#!/usr/bin/env node
/**
 * Asset compiler for photographs.
 *
 *   npm run publish-images
 *   npm run publish-images -- --dry-run
 *
 * Compiles assets/originals/ into optimised derivatives plus a manifest the
 * frontend reads. Incremental, resumable, and it validates its own output —
 * see the "Adding photographs" section of README.md for the workflow, and
 * scripts/images/config.mjs for every tunable.
 */

import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

import {
  COMPILER_VERSION,
  CONCURRENCY,
  FORMATS,
  HASHED_CONFIG,
  PATHS,
  POSTER_SUFFIX,
  PUBLIC_BASE_URL,
  SIZES,
} from './images/config.mjs';
import { cleanup } from './images/cleanup.mjs';
import { createManifestWriter, hashConfig, readManifest, stamp } from './images/manifest.mjs';
import { expectedFiles, processSource } from './images/processor.mjs';
import { scan } from './images/scanner.mjs';
import { codecName } from './images/video.mjs';
import { createLocalTarget } from './images/target.mjs';
import { validate } from './images/validator.mjs';

// ── output helpers ────────────────────────────────────────────────────────

const useColor = process.stdout.isTTY && !process.env.NO_COLOR;
const paint = (code, s) => (useColor ? `[${code}m${s}[0m` : s);
const dim = (s) => paint('2', s);
const bold = (s) => paint('1', s);
const green = (s) => paint('32', s);
const yellow = (s) => paint('33', s);
const red = (s) => paint('31', s);

const log = (s = '') => console.log(s);
const duration = (ms) => (ms < 1000 ? `${Math.round(ms)}ms` : `${(ms / 1000).toFixed(1)}s`);
const bytes = (n) => {
  const units = ['B', 'KB', 'MB', 'GB'];
  let i = 0;
  while (n >= 1024 && i < units.length - 1) (n /= 1024), i++;
  return `${n.toFixed(n < 10 && i > 0 ? 1 : 0)}${units[i]}`;
};
const plural = (n, one, many = `${one}s`) => `${n} ${n === 1 ? one : many}`;

// ── argument parsing ──────────────────────────────────────────────────────

function parseArgs(argv) {
  const args = new Set(argv.slice(2));
  if (args.has('--help') || args.has('-h')) return { help: true };
  const dryRun = args.has('--dry-run') || args.has('-n');
  const force = args.has('--force');

  const unknown = [...args].filter(
    (a) => !['--dry-run', '-n', '--force', '--help', '-h'].includes(a)
  );
  return { dryRun, force, unknown };
}

function showHelp() {
  log(`
${bold('npm run publish-images')} — compile assets/originals/ into web derivatives

  ${bold('npm run publish-images')}                 build what changed
  ${bold('npm run publish-images -- --dry-run')}    show the plan, change nothing
  ${bold('npm run publish-images -- --force')}      rebuild everything

Add or remove photographs in ${bold('assets/originals/<category>/')} and re-run.
Sizes, quality and formats live in ${bold('scripts/images/config.mjs')}.
`);
}

/**
 * `npm run publish-images --dry-run` (without `--`) is silently swallowed by
 * npm's own --dry-run flag, so the user would get a real run when they asked
 * for a preview. npm does leave a fingerprint in the environment, so catch it
 * and say what to type instead.
 */
function detectSwallowedDryRun() {
  const raw = process.env.npm_config_dry_run;
  return raw === 'true' || raw === '';
}

// ── bounded worker pool ───────────────────────────────────────────────────

/**
 * Run `worker` over `items`, at most `limit` at a time. Concurrency is what
 * keeps a 200-image run tolerable; the bound is what stops four 50MB decodes
 * turning into forty and exhausting RAM.
 */
async function pool(items, limit, worker) {
  const queue = [...items];
  const runners = Array.from({ length: Math.min(limit, queue.length) }, async () => {
    while (queue.length > 0) {
      const item = queue.shift();
      await worker(item);
    }
  });
  await Promise.all(runners);
}

// ── main ──────────────────────────────────────────────────────────────────

async function main() {
  const started = Date.now();
  const { help, dryRun, force, unknown } = parseArgs(process.argv);

  if (help) return showHelp(), 0;

  if (unknown?.length) {
    log(red(`Unknown option${unknown.length > 1 ? 's' : ''}: ${unknown.join(', ')}`));
    showHelp();
    return 1;
  }

  if (detectSwallowedDryRun() && !dryRun) {
    log(red('\nnpm swallowed --dry-run as its own flag, so this would have been a real run.'));
    log(`Use ${bold('npm run publish-images -- --dry-run')} (note the ${bold('--')}).\n`);
    return 1;
  }

  const configHash = hashConfig(HASHED_CONFIG);
  const target = createLocalTarget(PATHS.output);

  log('');
  log(bold(dryRun ? 'Publish images (dry run — nothing will be written)' : 'Publish images'));
  log(dim(`  formats: ${FORMATS.join(', ')} · tiers: ${Object.keys(SIZES).join(', ')}`));
  log(dim(`  output:  ${target.describe()}`));
  log('');

  try {
    await fs.access(PATHS.originals);
  } catch {
    const rel = path.relative(PATHS.root, PATHS.originals).replace(/\\/g, '/');
    log(red(`No originals directory at ${rel}/`));
    log(`Create it and add photographs in category folders, e.g. ${bold('assets/originals/weddings/')}.\n`);
    return 1;
  }

  // Clear scratch dirs from any previously interrupted run before we look at
  // what exists, so they can't be mistaken for real assets.
  if (!dryRun) {
    const swept = await target.sweepIncomplete();
    if (swept > 0) log(dim(`Swept ${plural(swept, 'incomplete directory', 'incomplete directories')} from a previous run`));
  }

  // ── scan ────────────────────────────────────────────────────────────────
  log('Scanning originals...');
  const previousManifest = force ? {} : await readManifest(PATHS.manifest);
  const presentAssets = await target.listAssets();

  // An asset counts as done only if every file its record promises is still
  // on disk — not merely that its directory exists.
  const isIntact = (id, record) => {
    const files = presentAssets.get(id);
    if (!files) return false;
    return expectedFiles(record).every((rel) => files.has(rel.slice(id.length + 1)));
  };

  const result = await scan({
    originalsDir: PATHS.originals,
    manifest: previousManifest,
    configHash,
    compilerVersion: COMPILER_VERSION,
    isIntact,
  });

  if (result.collisions.length > 0) {
    log('');
    log(red(bold('Filename collision — two originals produce the same id.')));
    log('Nothing was generated, written, or deleted. Rename one of each pair and re-run.\n');
    for (const { id, paths } of result.collisions) {
      log(`  ${bold(id)}`);
      for (const p of paths) log(`      ${red('✗')} ${p}`);
    }
    log('');
    return 1;
  }

  const imageCount = result.sources.filter((s) => s.type === 'image').length;
  const videoCount = result.sources.filter((s) => s.type === 'video').length;
  const parts = [plural(imageCount, 'original')];
  if (videoCount) parts.push(plural(videoCount, 'video'));
  if (result.warnings.length) parts.push(`${result.warnings.length} unknown`);
  log(`  Found ${parts.join(' · ')}`);

  for (const w of result.warnings) log(`  ${yellow('!')} ${w.path} — ${w.message}`);
  for (const e of result.errors) log(`  ${red('✗')} ${e.path} — ${e.message}`);

  // ── plan ────────────────────────────────────────────────────────────────
  const todo = [...result.created, ...result.modified];

  log('');
  log('Checking processed assets...');
  log(
    `  ${result.created.length} new · ${result.modified.length} modified · ` +
      `${result.deleted.length} deleted · ${dim(`${result.unchanged.length} unchanged`)}`
  );

  const reasons = [...new Set(result.modified.map((m) => m.reason))];
  if (reasons.length) log(dim(`  reason for rebuild: ${reasons.join(', ')}`));

  if (todo.length === 0 && result.deleted.length === 0 && result.errors.length === 0) {
    // Still verify: "nothing to do" must mean "and what's there is sound".
    const problems = await validate({ target, images: previousManifest });
    if (problems.length === 0) {
      log('');
      log(green('✓ Everything is up to date.'));
      log(dim(`  ${plural(Object.keys(previousManifest).length, 'asset')} · ${duration(Date.now() - started)}`));
      log('');
      return 0;
    }
    log('');
    log(yellow(`Manifest is current but output is inconsistent (${plural(problems.length, 'problem')}):`));
    for (const p of problems.slice(0, 10)) log(`  ${red('✗')} ${p}`);
    log(dim(`\nRun ${bold('npm run publish-images -- --force')} to rebuild.\n`));
    return 1;
  }

  if (dryRun) {
    log('');
    if (todo.length) {
      log(bold('Will generate:'));
      for (const s of todo) log(`  ${green('✓')} ${s.id}${s.reason ? dim(`  (${s.reason})`) : ''}`);
    }
    if (result.deleted.length) {
      log('');
      log(bold('Will remove:'));
      for (const id of result.deleted) log(`  ${red('✗')} ${id}`);
    }
    const after = Object.keys(previousManifest).length + result.created.length - result.deleted.length;
    log('');
    log(`Manifest changes: ${green(`+${result.created.length}`)} ${red(`-${result.deleted.length}`)} → ${after} entries`);
    log(dim('\nDry run — nothing was written.\n'));
    return result.errors.length > 0 ? 1 : 0;
  }

  // ── process ─────────────────────────────────────────────────────────────
  const images = { ...previousManifest };
  for (const id of result.deleted) delete images[id];

  const writer = createManifestWriter({
    manifestPath: PATHS.manifest,
    configHash,
    compilerVersion: COMPILER_VERSION,
    baseUrl: PUBLIC_BASE_URL,
    sizes: Object.fromEntries(Object.entries(SIZES).map(([k, v]) => [k, { width: v.width }])),
    formats: FORMATS,
  });

  const failures = [];
  let done = 0;

  if (todo.length > 0) {
    const workers = Math.min(CONCURRENCY, todo.length);
    log('');
    log(`Generating... ${dim(`(${plural(workers, 'worker')})`)}`);

    // Serialises manifest writes so two workers finishing at once cannot
    // interleave and lose an entry.
    let flushChain = Promise.resolve();

    await pool(todo, workers, async (source) => {
      const t0 = Date.now();
      try {
        const { files, record } = await processSource(source);
        await target.writeAsset(source.id, files);

        const entry = stamp(record, {
          sourceHash: source.sourceHash,
          configHash,
          compilerVersion: COMPILER_VERSION,
        });
        images[source.id] = entry;

        // Flush after every asset: the manifest is the completion marker, so
        // a Ctrl-C here must leave everything finished so far still recorded.
        flushChain = flushChain.then(() => writer.flush(images));
        await flushChain;

        done++;
        const detail =
          record.type === 'video'
            ? record.transcoded
              ? `${codecName(record.originalCodec)} → H.264, ` +
                `${bytes(record.originalSize)} → ${bytes(record.sources.at(-1).bytes)}`
              : `copied, ${bytes(record.originalSize)}`
            : `${record.width}×${record.height} → ${plural(Object.keys(record.derivatives).length, 'size')}`;
        const counter = dim(`[${String(done).padStart(String(todo.length).length)}/${todo.length}]`);
        log(`  ${counter} ${green('✓')} ${source.id.padEnd(34)} ${dim(`(${detail}, ${duration(Date.now() - t0)})`)}`);
      } catch (err) {
        done++;
        failures.push({ id: source.id, message: err.message });
        log(`  ${dim(`[${done}/${todo.length}]`)} ${red('✗')} ${source.id.padEnd(34)} ${red(err.message)}`);
      }
    });
  }

  // Link each video to its poster still, by the `<slug>-poster` convention.
  // Done here rather than in the processor because it is the only step that
  // needs to see other assets — a video and its poster are compiled
  // independently and in any order.
  for (const record of Object.values(images)) {
    if (record.type !== 'video') continue;
    const posterId = `${record.id}${POSTER_SUFFIX}`;
    record.poster = images[posterId] ? posterId : null;
  }

  // ── cleanup ─────────────────────────────────────────────────────────────
  const { removed, orphans } = await cleanup({
    target,
    manifestIds: Object.keys(images),
    deletedIds: result.deleted,
    dryRun: false,
  });

  await writer.flush(images);
  log('');
  log(`Manifest: ${plural(Object.keys(images).length, 'entry', 'entries')}`);

  const cleaned = removed.length + orphans.length;
  log(
    cleaned === 0
      ? 'Cleaning obsolete files... nothing to remove'
      : `Cleaning obsolete files... removed ${plural(removed.length, 'asset')}` +
          (orphans.length ? `, ${plural(orphans.length, 'orphan')}` : '')
  );
  for (const id of removed) log(`  ${red('−')} ${id}`);
  for (const id of orphans) log(`  ${red('−')} ${id} ${dim('(orphan)')}`);

  // ── validate ────────────────────────────────────────────────────────────
  const problems = await validate({ target, images });

  log('');
  if (problems.length > 0) {
    log(red(bold(`Validation failed — ${plural(problems.length, 'problem')}:`)));
    for (const p of problems) log(`  ${red('✗')} ${p}`);
  } else {
    log(green('Validation passed.'));
  }

  if (failures.length > 0) {
    log('');
    log(red(bold(`${plural(failures.length, 'image')} failed to process:`)));
    for (const f of failures) log(`  ${red('✗')} ${f.id} — ${f.message}`);
    log(dim('\nEverything else was written and recorded. Fix these and re-run;'));
    log(dim('the compiler will retry only what is still outstanding.'));
  }

  const failed = failures.length > 0 || problems.length > 0 || result.errors.length > 0;
  log('');
  log(failed ? red(`Finished with errors in ${duration(Date.now() - started)}.`) : `Done in ${duration(Date.now() - started)}.`);
  log('');
  return failed ? 1 : 0;
}

main()
  .then((code) => process.exit(code))
  .catch((err) => {
    log('');
    log(red(bold('The compiler crashed.')));
    log(red(err?.stack ?? String(err)));
    log(dim('\nNo partial output survives a crash — re-running is safe.\n'));
    process.exit(1);
  });
