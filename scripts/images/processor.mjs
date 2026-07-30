/**
 * Processor — one original in, every derivative plus a manifest record out.
 *
 * Pure with respect to storage: it returns buffers and never decides where
 * they go. That keeps it usable against any target, and makes future stages
 * (watermarking, AI cropping, face detection) additive — they slot in as
 * extra steps here without the CLI or the frontend contract changing.
 */

import fs from 'node:fs/promises';
import exifReader from 'exif-reader';
import sharp from 'sharp';

import ffmpegPath from 'ffmpeg-static';

import {
  BLUR,
  BROWSER_SAFE_VIDEO_CODECS,
  COPY_ORIGINAL,
  ENCODER_OPTIONS,
  EXTENSION_FOR_FORMAT,
  EXTRACT_DOMINANT_COLOR,
  EXTRACT_EXIF,
  FORMATS,
  OPTIMIZE_VIDEO,
  SIZES,
  VIDEO_ENCODE,
  VIDEO_KEEP_ORIGINAL_SOURCE,
} from './config.mjs';
import { faststart, probeCodecs, transcodeToH264, verifyFaststart } from './video.mjs';

/** ffmpeg-static resolves to null on platforms it ships no binary for. */
const FFMPEG_PATH = ffmpegPath ?? null;

const encode = (pipeline, format, quality) =>
  pipeline[format]({ quality, ...(ENCODER_OPTIONS[format] ?? {}) }).toBuffer({
    resolveWithObject: true,
  });

/**
 * Fit inside a square of `width`, so the longest edge is the budget regardless
 * of orientation. `withoutEnlargement` is what guarantees we never upscale —
 * a 400px original stays 400px even in the `large` tier.
 */
const resized = (base, width) =>
  base.clone().resize({ width, height: width, fit: 'inside', withoutEnlargement: true });

function toHex({ r, g, b }) {
  const clamp = (v) => Math.max(0, Math.min(255, Math.round(v)));
  return `#${[r, g, b].map((v) => clamp(v).toString(16).padStart(2, '0')).join('')}`;
}

/**
 * EXIF lives in a raw buffer on sharp's metadata. Parsing is best-effort:
 * a corrupt or absent block must never fail an otherwise good photograph.
 */
function parseExif(buffer) {
  if (!buffer) return null;
  let raw;
  try {
    raw = exifReader(buffer);
  } catch {
    return null;
  }

  const image = raw?.Image ?? {};
  const photo = raw?.Photo ?? {};
  const exposure = photo.ExposureTime;

  // Most bodies already repeat the make in the model ("Canon" + "Canon EOS
  // R6m2"), so only prefix when it actually adds something.
  const make = image.Make?.trim();
  const model = image.Model?.trim();
  const camera =
    model && make && !model.toLowerCase().startsWith(make.toLowerCase())
      ? `${make} ${model}`
      : model || make || null;

  const value = {
    camera,
    lens: photo.LensModel ?? null,
    iso: photo.ISOSpeedRatings ?? null,
    exposure:
      typeof exposure === 'number'
        ? exposure >= 1
          ? `${exposure}s`
          : `1/${Math.round(1 / exposure)}`
        : null,
    aperture: typeof photo.FNumber === 'number' ? `f/${photo.FNumber}` : null,
    focalLength: typeof photo.FocalLength === 'number' ? `${Math.round(photo.FocalLength)}mm` : null,
    captureDate: (photo.DateTimeOriginal ?? image.DateTime ?? null)?.toISOString?.() ?? null,
  };

  return Object.values(value).some((v) => v !== null) ? value : null;
}

/**
 * Video is passed through rather than re-encoded — this compiler does not
 * pretend to be a video pipeline. The one exception is faststart remuxing,
 * which moves the MP4 index ahead of the media so playback can begin
 * immediately. That rearranges the container without touching a single byte of
 * the media payload, so it is lossless by construction.
 */
export async function processPassthrough(source) {
  const buffer = await fs.readFile(source.absolute);
  const stats = await fs.stat(source.absolute);
  const isMp4 = source.extension === '.mp4' || source.extension === '.mov';

  const files = new Map();
  const sources = [];
  const codecs = isMp4 ? probeCodecs(buffer) : { video: null, audio: null };
  const playable = !codecs.video || BROWSER_SAFE_VIDEO_CODECS.includes(codecs.video);

  /** Faststart an MP4 so playback can start before the file has arrived. */
  const withFaststart = (buf) => {
    if (!OPTIMIZE_VIDEO || !isMp4) return { buffer: buf, moved: false };
    const result = faststart(buf);
    if (!result.moved) return { buffer: buf, moved: false };
    // Never ship a remux we cannot prove is sound.
    const problem = verifyFaststart(result.buffer);
    if (problem) throw new Error(`faststart produced an invalid file: ${problem}`);
    return result;
  };

  if (playable) {
    const { buffer: out, moved } = withFaststart(buffer);
    const name = `original${source.extension}`;
    files.set(name, out);
    sources.push({
      file: `${source.id}/${name}`,
      mimeType: source.extension === '.webm' ? 'video/webm' : 'video/mp4',
      codec: codecs.video,
      transcoded: false,
      faststart: moved,
      bytes: out.byteLength,
    });
  } else {
    // Unplayable in most browsers — publish an H.264 rendition. This is the
    // only lossy thing the compiler does, and it happens because the
    // alternative is a video that silently fails for most visitors.
    const h264 = await transcodeToH264(source.absolute, {
      ...VIDEO_ENCODE,
      ffmpegPath: FFMPEG_PATH,
      audioCodec: codecs.audio,
    });

    // Optionally keep the original ahead of it: Safari can decode HEVC and
    // gets a file that was never re-encoded.
    if (VIDEO_KEEP_ORIGINAL_SOURCE) {
      const { buffer: out, moved } = withFaststart(buffer);
      const name = `source${source.extension}`;
      files.set(name, out);
      sources.push({
        file: `${source.id}/${name}`,
        // The codec must be advertised, or a browser that cannot decode HEVC
        // will still pick this source and show nothing.
        mimeType: `video/mp4; codecs="${codecs.video}"`,
        codec: codecs.video,
        transcoded: false,
        faststart: moved,
        bytes: out.byteLength,
      });
    }

    files.set('h264.mp4', h264);
    sources.push({
      file: `${source.id}/h264.mp4`,
      mimeType: 'video/mp4; codecs="avc1"',
      codec: 'avc1',
      transcoded: true,
      faststart: true, // ffmpeg wrote it with +faststart
      bytes: h264.byteLength,
    });
  }

  return {
    files,
    record: {
      id: source.id,
      type: 'video',
      category: source.category,
      sourcePath: source.sourcePath,
      mimeType: sources.at(-1).mimeType,
      originalSize: stats.size,
      originalCodec: codecs.video,
      audioCodec: codecs.audio,
      width: codecs.width || null,
      height: codecs.height || null,
      transcoded: !playable,
      sources,
      // The last source is the universally-decodable one, so it is the safest
      // single URL for anything that cannot use a <source> list.
      file: sources.at(-1).file,
    },
  };
}

/**
 * @param {{id, category, sourcePath, absolute, extension}} source
 * @returns {{files: Map<string,Buffer>, record: object}}
 */
export async function processImage(source) {
  // Read once. Every tier and format below works from this single buffer, so
  // a 40MB master is pulled off disk and decoded once, not once per output.
  const input = await fs.readFile(source.absolute);

  const base = sharp(input, { failOn: 'error' })
    // Bake in the EXIF orientation, then reason about dimensions in display
    // space. Without this a portrait shot from a rotated sensor would be
    // sized as landscape and come out sideways.
    .rotate();

  const metadata = await base.metadata();
  if (!metadata.width || !metadata.height) {
    throw new Error('Could not read image dimensions — file may be corrupt.');
  }

  // sharp reports pre-rotation dimensions; swap for a quarter-turn EXIF flag.
  const rotated = (metadata.orientation ?? 1) >= 5;
  const width = rotated ? metadata.height : metadata.width;
  const height = rotated ? metadata.width : metadata.height;

  const files = new Map();
  const derivatives = {};

  for (const [name, tier] of Object.entries(SIZES)) {
    const pipeline = resized(base, tier.width);
    const entry = {};

    for (const format of FORMATS) {
      const ext = EXTENSION_FOR_FORMAT[format];
      const { data, info } = await encode(pipeline.clone(), format, tier.quality);
      const filename = `${name}.${ext}`;
      files.set(filename, data);
      entry[format] = `${source.id}/${filename}`;
      // Every format of a tier shares dimensions; recording once is enough.
      entry.width = info.width;
      entry.height = info.height;
      entry.bytes = { ...(entry.bytes ?? {}), [format]: info.size };
    }
    derivatives[name] = entry;
  }

  // Blur placeholder: always WebP regardless of FORMATS, because it is inlined
  // into the HTML as a data URI and WebP gives the smallest usable result.
  const { data: blurData } = await encode(resized(base, BLUR.width), 'webp', BLUR.quality);
  files.set('blur.webp', blurData);

  let dominantColor = null;
  if (EXTRACT_DOMINANT_COLOR) {
    try {
      // Run stats on an already-tiny clone rather than the full-size image —
      // the expensive decode is shared, and averaging 20px is free.
      const { channels } = await resized(base, 64).stats();
      const [r, g, b] = channels.map((c) => c.mean);
      dominantColor = toHex({ r, g, b });
    } catch {
      dominantColor = null;
    }
  }

  if (COPY_ORIGINAL) {
    // The master, byte-for-byte. Never re-encoded, never resized.
    files.set(`original${source.extension}`, input);
  }

  const record = {
    id: source.id,
    type: 'image',
    category: source.category,
    sourcePath: source.sourcePath,
    width,
    height,
    aspectRatio: Number((width / height).toFixed(4)),
    orientation: metadata.orientation ?? 1,
    mimeType: `image/${metadata.format === 'jpg' ? 'jpeg' : metadata.format}`,
    originalSize: input.byteLength,
    hasAlpha: Boolean(metadata.hasAlpha),
    dominantColor,
    blur: `${source.id}/blur.webp`,
    blurDataURL: `data:image/webp;base64,${blurData.toString('base64')}`,
    exif: EXTRACT_EXIF ? parseExif(metadata.exif) : null,
    original: COPY_ORIGINAL ? `${source.id}/original${source.extension}` : null,
    derivatives,
  };

  return { files, record };
}

export async function processSource(source) {
  return source.type === 'video' ? processPassthrough(source) : processImage(source);
}

/** Filenames this config is expected to produce — used by the validator. */
export function expectedFiles(record) {
  if (record.type === 'video') {
    return record.sources?.length ? record.sources.map((s) => s.file) : [record.file];
  }
  const out = [record.blur];
  for (const tier of Object.values(record.derivatives ?? {})) {
    for (const format of FORMATS) if (tier[format]) out.push(tier[format]);
  }
  if (record.original) out.push(record.original);
  return out;
}
