/**
 * Scanner — reads assets/originals/, works out what the compiler must do.
 *
 * Produces a plan, never a side effect: nothing here writes, deletes, or
 * touches sharp. That is what lets --dry-run share this exact code path with
 * a real run.
 */

import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';

import { ASSET_TYPES, IGNORED_NAMES } from './config.mjs';

/**
 * Filename → URL-safe slug. Lowercases, strips the extension, collapses
 * anything non-alphanumeric into single hyphens.
 *
 *   DSC_001.jpg      → dsc-001
 *   Bride & Groom.jpg → bride-groom
 */
export function slugify(filename) {
  return path
    .basename(filename, path.extname(filename))
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function classify(filename) {
  const ext = path.extname(filename).toLowerCase();
  const lower = filename.toLowerCase();

  if (IGNORED_NAMES.includes(lower) || filename.startsWith('.')) return { kind: 'ignored' };
  // `_`-prefixed names are reserved for sidecar metadata (see roadmap).
  if (filename.startsWith('_')) return { kind: 'ignored' };

  if (ASSET_TYPES.image.includes(ext)) return { kind: 'image' };
  if (ASSET_TYPES.passthrough.includes(ext)) return { kind: 'passthrough' };
  if (ext in ASSET_TYPES.unsupported) {
    return { kind: 'unsupported', reason: ASSET_TYPES.unsupported[ext] };
  }
  return { kind: 'unknown' };
}

async function walk(dir, relative = '') {
  const out = [];
  let entries;
  try {
    entries = await fs.readdir(dir, { withFileTypes: true });
  } catch {
    return out;
  }
  for (const entry of entries) {
    const rel = relative ? `${relative}/${entry.name}` : entry.name;
    if (entry.isDirectory()) {
      out.push(...(await walk(path.join(dir, entry.name), rel)));
    } else if (entry.isFile()) {
      out.push({ absolute: path.join(dir, entry.name), relative: rel, name: entry.name });
    }
  }
  return out;
}

async function hashFile(absolute) {
  const hash = crypto.createHash('sha256');
  const handle = await fs.open(absolute, 'r');
  try {
    // Streamed rather than read whole — masters run 20–50MB and the scanner
    // hashes every file on every run, including ones it will then skip.
    const stream = handle.createReadStream();
    for await (const chunk of stream) hash.update(chunk);
  } finally {
    await handle.close();
  }
  return `sha256:${hash.digest('hex')}`;
}

/**
 * Scan originals and diff against the previous manifest.
 *
 * @param {object}   opts
 * @param {string}   opts.originalsDir
 * @param {object}   opts.manifest        previous manifest ({} on first run)
 * @param {string}   opts.configHash
 * @param {number}   opts.compilerVersion
 * @param {(id: string, record: object) => boolean} opts.isIntact
 *        whether the target still holds every file the record promises
 */
export async function scan({
  originalsDir,
  manifest,
  configHash,
  compilerVersion,
  isIntact,
}) {
  const files = await walk(originalsDir);

  const sources = [];
  const warnings = [];
  const errors = [];
  let ignored = 0;

  for (const file of files) {
    const { kind, reason } = classify(file.name);
    if (kind === 'ignored') {
      ignored++;
      continue;
    }
    if (kind === 'unsupported') {
      errors.push({ path: file.relative, message: reason });
      continue;
    }
    if (kind === 'unknown') {
      warnings.push({ path: file.relative, message: 'Unrecognised file type — skipped.' });
      continue;
    }

    const segments = file.relative.split('/');
    if (segments.length < 2) {
      warnings.push({
        path: file.relative,
        message: 'Loose file at the top level — put it in a category folder, e.g. originals/weddings/.',
      });
      continue;
    }

    // Everything above the filename is the category, so nested folders like
    // weddings/2026/spring/ work and become part of the id.
    const category = segments.slice(0, -1).join('/');
    sources.push({
      id: `${category}/${slugify(file.name)}`,
      category,
      type: kind === 'image' ? 'image' : 'video',
      sourcePath: file.relative,
      absolute: file.absolute,
      extension: path.extname(file.name).toLowerCase(),
    });
  }

  // Two different filenames can slugify to one id (Bride.jpg / Bride.jpeg).
  // This is a hard error: silently letting one overwrite the other would mean
  // a photograph vanishes from the site with no signal at all.
  const byId = new Map();
  const collisions = [];
  for (const source of sources) {
    const existing = byId.get(source.id);
    if (existing) {
      const collision = collisions.find((c) => c.id === source.id);
      if (collision) collision.paths.push(source.sourcePath);
      else collisions.push({ id: source.id, paths: [existing.sourcePath, source.sourcePath] });
    } else {
      byId.set(source.id, source);
    }
  }
  if (collisions.length > 0) return { collisions, sources: [], warnings, errors, ignored };

  const compilerChanged = Object.values(manifest).some(
    (entry) => (entry.compilerVersion ?? 0) !== compilerVersion
  );

  const created = [];
  const modified = [];
  const unchanged = [];

  for (const source of sources) {
    const previous = manifest[source.id];
    source.sourceHash = await hashFile(source.absolute);

    if (!previous) {
      created.push(source);
    } else if (previous.sourceHash !== source.sourceHash) {
      modified.push({ ...source, reason: 'source changed' });
    } else if (previous.configHash !== configHash) {
      modified.push({ ...source, reason: 'config changed' });
    } else if ((previous.compilerVersion ?? 0) !== compilerVersion) {
      modified.push({ ...source, reason: 'compiler changed' });
    } else if (!isIntact(source.id, previous)) {
      // Recorded as done, but a promised file is gone — an interrupted swap,
      // or someone deleted output by hand. Repair it rather than making the
      // user work out that they need --force.
      modified.push({ ...source, reason: 'output missing' });
    } else {
      unchanged.push(source);
    }
  }

  const liveIds = new Set(sources.map((s) => s.id));
  const deleted = Object.keys(manifest).filter((id) => !liveIds.has(id));

  return {
    collisions: [],
    sources,
    created,
    modified,
    unchanged,
    deleted,
    warnings,
    errors,
    ignored,
    compilerChanged,
  };
}
