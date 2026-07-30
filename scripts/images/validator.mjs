/**
 * Validator — refuse to call a run successful if the output is inconsistent.
 *
 * This is the part that stops a broken deploy. Everything upstream can be
 * correct in isolation and still leave the site referencing a file that isn't
 * there, so the last thing the compiler does is check its own work.
 */

import { BROWSER_SAFE_VIDEO_CODECS } from './config.mjs';
import { expectedFiles } from './processor.mjs';
import { codecName } from './video.mjs';

export async function validate({ target, images }) {
  const problems = [];
  const entries = Object.entries(images);

  // 1. Every file the manifest promises actually exists.
  for (const [id, record] of entries) {
    for (const relPath of expectedFiles(record)) {
      if (!(await target.hasFile(relPath))) {
        problems.push(`${id}: manifest references missing file "${relPath}"`);
      }
    }
  }

  // 2. Nothing in the target is unaccounted for.
  const known = new Set(Object.keys(images));
  for (const id of await target.listAssetIds()) {
    if (!known.has(id)) problems.push(`${id}: output directory has no manifest entry (orphan)`);
  }

  // 3. Ids are unique. The scanner is the enforcing gate for slug collisions;
  //    this is the backstop that would catch a manifest merged badly by hand.
  const seen = new Set();
  for (const id of Object.keys(images)) {
    if (seen.has(id)) problems.push(`${id}: duplicate manifest id`);
    seen.add(id);
  }

  // 4. Image records carry what the frontend needs to render without CLS.
  for (const [id, record] of entries) {
    if (record.type !== 'image') continue;
    if (!record.width || !record.height) problems.push(`${id}: missing intrinsic dimensions`);
    if (!record.blurDataURL) problems.push(`${id}: missing blur placeholder`);
    if (!record.derivatives || Object.keys(record.derivatives).length === 0) {
      problems.push(`${id}: no derivatives recorded`);
    }
    // A derivative larger than its source means the no-upscale rule broke.
    for (const [tier, d] of Object.entries(record.derivatives ?? {})) {
      if (d.width > record.width || d.height > record.height) {
        problems.push(
          `${id}: "${tier}" (${d.width}×${d.height}) is larger than the original ` +
            `(${record.width}×${record.height}) — upscaling occurred`
        );
      }
    }
  }

  // 5. Every video ends in a codec browsers can actually decode.
  //     This is the failure that reached the live site unnoticed: HEVC plays
  //     in Safari and on the exporting machine, and elsewhere shows a poster
  //     and plays its audio, so it reads as "slow" rather than "broken".
  for (const [id, record] of entries) {
    if (record.type !== 'video') continue;
    const fallback = record.sources?.at(-1);
    if (!fallback) {
      problems.push(`${id}: video has no playable source`);
    } else if (!BROWSER_SAFE_VIDEO_CODECS.includes(fallback.codec)) {
      problems.push(
        `${id}: final source is ${codecName(fallback.codec)}, which Chrome and Firefox ` +
          `cannot decode — the video will not play for most visitors`
      );
    }
  }

  // 6. No scratch directories survived the run.
  const leftovers = await target.sweepIncomplete();
  if (leftovers > 0) {
    problems.push(`${leftovers} incomplete scratch director${leftovers === 1 ? 'y' : 'ies'} remained after the run`);
  }

  return problems;
}
