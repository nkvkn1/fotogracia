/**
 * Write target — the only module that knows where output physically lives.
 *
 * Everything upstream (processor, manifest, cleanup, validator) deals in
 * relative paths like "weddings/dsc-001/large.webp" and never in absolute
 * URLs or filesystem paths. That is what makes moving to a CDN a matter of
 * adding one module here rather than a migration.
 *
 * The interface is deliberately *asset*-level rather than file-level:
 *
 *   writeAsset(id, files)   place every file for one image, all-or-nothing
 *   removeAsset(id)         remove every file for one image
 *   listAssetIds()          which assets currently exist in the target
 *   hasFile(relPath)        does one specific file exist (validation)
 *   sweepIncomplete()       drop partial state left by an interrupted run
 *
 * Atomicity is the target's problem, not the caller's. LocalTarget gets it
 * from directory renames; a future RemoteTarget would upload every object
 * before the manifest records the asset, which yields the same guarantee
 * (the manifest, not the bucket listing, is the source of truth).
 */

import fs from 'node:fs/promises';
import path from 'node:path';

const TMP_PREFIX = '.tmp-';
const OLD_PREFIX = '.old-';

/** Directory entries the asset walker must never mistake for an asset. */
const isScratchDir = (name) =>
  name.startsWith(TMP_PREFIX) || name.startsWith(OLD_PREFIX);

export function createLocalTarget(outputRoot) {
  const dirFor = (id) => path.join(outputRoot, ...id.split('/'));

  return {
    describe: () => path.relative(process.cwd(), outputRoot).replace(/\\/g, '/'),

    /**
     * Write every file for one asset, atomically.
     *
     * Files land in a *sibling* temp directory first — not one nested inside
     * the destination, which could never be renamed onto its own parent — and
     * the directory is swapped into place only once every write succeeded.
     * A crash therefore leaves a complete asset or an ignorable scratch dir,
     * never a half-populated one.
     *
     * @param {string} id                 e.g. "weddings/dsc-001"
     * @param {Map<string,Buffer>} files  filename → contents
     */
    async writeAsset(id, files) {
      const finalDir = dirFor(id);
      const parent = path.dirname(finalDir);
      const slug = path.basename(finalDir);
      const stamp = `${process.pid}-${Math.random().toString(36).slice(2, 8)}`;
      const tmpDir = path.join(parent, `${TMP_PREFIX}${slug}-${stamp}`);
      const oldDir = path.join(parent, `${OLD_PREFIX}${slug}-${stamp}`);

      await fs.mkdir(tmpDir, { recursive: true });
      try {
        for (const [name, buffer] of files) {
          await fs.writeFile(path.join(tmpDir, name), buffer);
        }

        // Swap. Renaming onto an existing directory is not portable, so move
        // the incumbent aside first. If the process dies mid-swap the asset is
        // briefly absent from the target — harmless, because the scanner
        // treats "in the manifest but missing from the target" as work to redo.
        const hadPrevious = await exists(finalDir);
        if (hadPrevious) await fs.rename(finalDir, oldDir);
        await fs.rename(tmpDir, finalDir);
        if (hadPrevious) await fs.rm(oldDir, { recursive: true, force: true });
      } catch (err) {
        await fs.rm(tmpDir, { recursive: true, force: true }).catch(() => {});
        throw err;
      }
    },

    async removeAsset(id) {
      await fs.rm(dirFor(id), { recursive: true, force: true });
      // Prune the category directory if this was the last asset in it.
      const parent = path.dirname(dirFor(id));
      if (parent !== outputRoot) {
        const remaining = await readdirSafe(parent);
        if (remaining.length === 0) await fs.rm(parent, { recursive: true, force: true });
      }
    },

    /** Asset ids ("category/slug") currently present in the target. */
    async listAssetIds() {
      return [...(await this.listAssets()).keys()];
    },

    /**
     * Every asset in the target, mapped to the files it actually contains.
     *
     * Listing contents rather than just directory names costs one readdir per
     * asset — the same walk either way — and lets the scanner notice a file
     * deleted by hand, so the next run repairs it instead of demanding
     * --force.
     *
     * @returns {Map<string, Set<string>>} id → filenames
     */
    async listAssets() {
      const assets = new Map();
      for (const category of await readdirSafe(outputRoot)) {
        if (isScratchDir(category.name) || !category.isDirectory()) continue;
        const categoryDir = path.join(outputRoot, category.name);
        for (const slug of await readdirSafe(categoryDir)) {
          if (isScratchDir(slug.name) || !slug.isDirectory()) continue;
          const files = await readdirSafe(path.join(categoryDir, slug.name));
          assets.set(
            `${category.name}/${slug.name}`,
            new Set(files.filter((f) => f.isFile()).map((f) => f.name))
          );
        }
      }
      return assets;
    },

    hasFile: (relPath) => exists(path.join(outputRoot, ...relPath.split('/'))),

    /**
     * Remove scratch directories from an interrupted run. Safe to call at any
     * time: a live run's scratch dirs are named with its own pid, and a run
     * only sweeps before it starts writing.
     */
    async sweepIncomplete() {
      let removed = 0;
      const sweepIn = async (dir) => {
        for (const entry of await readdirSafe(dir)) {
          if (!entry.isDirectory()) continue;
          if (isScratchDir(entry.name)) {
            await fs.rm(path.join(dir, entry.name), { recursive: true, force: true });
            removed++;
          }
        }
      };
      await sweepIn(outputRoot);
      for (const category of await readdirSafe(outputRoot)) {
        if (category.isDirectory() && !isScratchDir(category.name)) {
          await sweepIn(path.join(outputRoot, category.name));
        }
      }
      return removed;
    },
  };
}

async function exists(p) {
  try {
    await fs.access(p);
    return true;
  } catch {
    return false;
  }
}

async function readdirSafe(dir) {
  try {
    return await fs.readdir(dir, { withFileTypes: true });
  } catch {
    return [];
  }
}
