/**
 * Video optimisation — "faststart" remuxing, with no ffmpeg dependency.
 *
 * An MP4 keeps its media in `mdat` and its index in `moov`. A player cannot
 * begin until it has `moov`, so when an encoder writes `moov` last (which most
 * do by default) the browser has to fetch the tail of the file before the
 * first frame appears. On a 34MB reel that is the difference between instant
 * playback and a black box.
 *
 * Moving `moov` in front of `mdat` is a purely structural change: the media
 * bytes are untouched, but every chunk offset in the index now points
 * `moov.size` bytes further into the file, so those tables have to be
 * rewritten. That is all `ffmpeg -movflags +faststart` does, and it is small
 * enough to do here rather than take on a 70MB binary dependency.
 *
 * The original file is never modified — this returns a new buffer.
 */

import { execFile } from 'node:child_process';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { promisify } from 'node:util';

const run = promisify(execFile);

/** Boxes that contain other boxes on the path to the chunk-offset tables. */
const CONTAINERS = new Set(['moov', 'trak', 'mdia', 'minf', 'stbl', 'edts', 'udta']);

/** Walk the boxes at one level of the tree. */
function readBoxes(buffer, start = 0, end = buffer.length) {
  const boxes = [];
  let offset = start;

  while (offset + 8 <= end) {
    let size = buffer.readUInt32BE(offset);
    const type = buffer.toString('latin1', offset + 4, offset + 8);
    let headerSize = 8;

    if (size === 1) {
      // 64-bit extended size, for payloads above 4GB.
      if (offset + 16 > end) break;
      size = Number(buffer.readBigUInt64BE(offset + 8));
      headerSize = 16;
    } else if (size === 0) {
      // "Extends to end of file."
      size = end - offset;
    }

    if (size < headerSize || offset + size > end) break;
    boxes.push({ type, start: offset, size, headerSize });
    offset += size;
  }
  return boxes;
}

/**
 * Add `delta` to every chunk offset in the index, in place.
 *
 * `stco` holds 32-bit offsets and `co64` 64-bit ones; which is used depends on
 * how large the source file was. Both have the same shape: a version/flags
 * word, an entry count, then that many offsets.
 */
function shiftChunkOffsets(moov, delta) {
  let patched = 0;

  const walk = (start, end) => {
    for (const box of readBoxes(moov, start, end)) {
      const bodyStart = box.start + box.headerSize;
      const bodyEnd = box.start + box.size;

      if (box.type === 'stco' || box.type === 'co64') {
        const count = moov.readUInt32BE(bodyStart + 4);
        const wide = box.type === 'co64';
        const width = wide ? 8 : 4;

        if (bodyStart + 8 + count * width > bodyEnd) {
          throw new Error(`${box.type} table overruns its box — refusing to patch`);
        }

        for (let i = 0; i < count; i++) {
          const at = bodyStart + 8 + i * width;
          if (wide) {
            moov.writeBigUInt64BE(moov.readBigUInt64BE(at) + BigInt(delta), at);
          } else {
            const next = moov.readUInt32BE(at) + delta;
            if (next > 0xffffffff) {
              throw new Error('chunk offset would overflow 32 bits — needs co64, refusing to patch');
            }
            moov.writeUInt32BE(next, at);
          }
        }
        patched += count;
      } else if (CONTAINERS.has(box.type)) {
        walk(bodyStart, bodyEnd);
      }
    }
  };

  walk(0, moov.length);
  return patched;
}

/**
 * @returns {{buffer: Buffer, moved: true, offsets: number} | {moved: false, reason: string}}
 */
export function faststart(input) {
  const boxes = readBoxes(input);
  if (boxes.length === 0) return { moved: false, reason: 'not an MP4 container' };

  const moov = boxes.find((b) => b.type === 'moov');
  const mdat = boxes.find((b) => b.type === 'mdat');

  if (!moov || !mdat) return { moved: false, reason: 'no moov/mdat boxes' };
  if (moov.start < mdat.start) return { moved: false, reason: 'already faststart' };

  // Boxes that stay in front. Anything else keeps its relative order behind moov.
  const leading = [];
  for (const box of boxes) {
    if (box.type === 'ftyp' || (leading.length > 0 && box.type === 'free' && box.start < mdat.start)) {
      leading.push(box);
    } else break;
  }

  const moovCopy = Buffer.from(input.subarray(moov.start, moov.start + moov.size));

  // Everything between the leading boxes and the end shifts forward by exactly
  // the size of the index we are inserting ahead of it.
  const offsets = shiftChunkOffsets(moovCopy, moov.size);
  if (offsets === 0) return { moved: false, reason: 'no chunk offset tables found' };

  const rest = boxes.filter((b) => b !== moov && !leading.includes(b));
  const output = Buffer.concat([
    ...leading.map((b) => input.subarray(b.start, b.start + b.size)),
    moovCopy,
    ...rest.map((b) => input.subarray(b.start, b.start + b.size)),
  ]);

  if (output.length !== input.length) {
    throw new Error(`faststart changed file size (${input.length} → ${output.length})`);
  }

  return { buffer: output, moved: true, offsets };
}

/**
 * Sanity-check a remuxed file before it is allowed anywhere near the site:
 * the index must now come first, and every chunk offset it declares must land
 * inside the media payload.
 */
export function verifyFaststart(output) {
  const boxes = readBoxes(output);
  const moov = boxes.find((b) => b.type === 'moov');
  const mdat = boxes.find((b) => b.type === 'mdat');

  if (!moov || !mdat) return 'missing moov or mdat after remux';
  if (moov.start > mdat.start) return 'moov is still after mdat';

  const mediaStart = mdat.start + mdat.headerSize;
  const mediaEnd = mdat.start + mdat.size;
  let checked = 0;
  let problem = null;

  const walk = (start, end) => {
    for (const box of readBoxes(output, start, end)) {
      const bodyStart = box.start + box.headerSize;
      const bodyEnd = box.start + box.size;
      if (box.type === 'stco' || box.type === 'co64') {
        const count = output.readUInt32BE(bodyStart + 4);
        const wide = box.type === 'co64';
        const width = wide ? 8 : 4;
        for (let i = 0; i < count; i++) {
          const at = bodyStart + 8 + i * width;
          const value = wide ? Number(output.readBigUInt64BE(at)) : output.readUInt32BE(at);
          if (value < mediaStart || value >= mediaEnd) {
            problem ??= `chunk offset ${value} outside mdat [${mediaStart}, ${mediaEnd})`;
          }
          checked++;
        }
      } else if (CONTAINERS.has(box.type)) {
        walk(bodyStart, bodyEnd);
      }
    }
  };
  walk(moov.start + moov.headerSize, moov.start + moov.size);

  if (checked === 0) return 'no chunk offsets to verify';
  return problem;
}

// ── codec inspection ──────────────────────────────────────────────────────

/**
 * Read the codecs out of an MP4's index.
 *
 * Worth doing because the failure it catches is invisible: an HEVC file plays
 * perfectly in Safari and on the machine it was exported from, shows a poster
 * and plays its AAC audio in Chrome, and looks for all the world like a video
 * that is merely slow to start.
 *
 * @returns {{video: string|null, audio: string|null, width: number, height: number}}
 */
export function probeCodecs(buffer) {
  const result = { video: null, audio: null, width: 0, height: 0 };
  let handler = null;

  const walk = (start, end) => {
    for (const box of readBoxes(buffer, start, end)) {
      const bodyStart = box.start + box.headerSize;
      const bodyEnd = box.start + box.size;

      if (box.type === 'hdlr') {
        handler = buffer.toString('latin1', bodyStart + 8, bodyStart + 12);
      } else if (box.type === 'stsd') {
        // version/flags (4) + entry count (4), then the sample entries.
        for (const entry of readBoxes(buffer, bodyStart + 8, bodyEnd)) {
          if (handler === 'vide' && !result.video) {
            result.video = entry.type;
            // Fixed offsets within a visual sample entry.
            result.width = buffer.readUInt16BE(entry.start + 8 + 24);
            result.height = buffer.readUInt16BE(entry.start + 8 + 26);
          } else if (handler === 'soun' && !result.audio) {
            result.audio = entry.type;
          }
        }
      } else if (CONTAINERS.has(box.type)) {
        walk(bodyStart, bodyEnd);
      }
    }
  };

  walk(0, buffer.length);
  return result;
}

/** Human-readable name for a sample-entry fourcc. */
export function codecName(fourcc) {
  const names = {
    avc1: 'H.264', avc3: 'H.264',
    hvc1: 'HEVC/H.265', hev1: 'HEVC/H.265',
    vp08: 'VP8', vp09: 'VP9', av01: 'AV1',
    ap4h: 'ProRes 4444', apch: 'ProRes 422 HQ', apcn: 'ProRes 422',
    mp4a: 'AAC', Opus: 'Opus', 'ac-3': 'AC-3',
  };
  return names[fourcc] ?? fourcc ?? 'unknown';
}

// ── transcoding ───────────────────────────────────────────────────────────

/**
 * Re-encode to H.264 8-bit — the only video codec every current browser can
 * decode. Audio is copied when it is already AAC so we do not lose a
 * generation on sound for no reason.
 *
 * `-movflags +faststart` puts the index first, so transcoded output needs no
 * separate remux.
 *
 * @param {string} inputPath  the untouched master; never written to
 * @param {object} options    { crf, preset, maxHeight, ffmpegPath }
 * @returns {Promise<Buffer>}
 */
export async function transcodeToH264(inputPath, { crf, preset, maxHeight, ffmpegPath, audioCodec }) {
  if (!ffmpegPath) {
    throw new Error(
      'ffmpeg is not available — install it with `npm install --save-dev ffmpeg-static`, ' +
        'or re-export this video as H.264 yourself.'
    );
  }

  const dir = await fs.mkdtemp(path.join(os.tmpdir(), 'fotogracia-video-'));
  const outPath = path.join(dir, 'out.mp4');

  // Scale down only if taller than the cap, and keep dimensions even (H.264
  // chroma subsampling requires it). -2 preserves the aspect ratio.
  const scale = `scale=-2:'min(${maxHeight},ih)'`;

  const args = [
    '-hide_banner', '-loglevel', 'error', '-nostdin', '-y',
    '-i', inputPath,
    '-map', '0:v:0', '-map', '0:a?', // first video track, audio if present
    '-c:v', 'libx264',
    '-profile:v', 'high', '-pix_fmt', 'yuv420p', // 8-bit: the universally decodable path
    '-crf', String(crf),
    '-preset', preset,
    '-vf', scale,
    '-c:a', audioCodec === 'mp4a' ? 'copy' : 'aac',
    '-b:a', '160k',
    '-movflags', '+faststart',
    outPath,
  ];

  try {
    await run(ffmpegPath, args, { maxBuffer: 1024 * 1024 * 32 });
    return await fs.readFile(outPath);
  } catch (err) {
    const detail = (err.stderr || err.message || '').toString().trim().split('\n').slice(-3).join(' ');
    throw new Error(`ffmpeg failed to transcode: ${detail}`);
  } finally {
    await fs.rm(dir, { recursive: true, force: true }).catch(() => {});
  }
}
