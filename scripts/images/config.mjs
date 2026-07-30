/**
 * Asset compiler configuration — the single source of truth.
 *
 * Every tunable lives here. No size, quality, or format literal should appear
 * anywhere else in the codebase (including the frontend, which reads SIZES
 * through lib/images.js). Change a value here, re-run `npm run publish-images`,
 * and the compiler works out exactly which files are now stale.
 */

import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');

/**
 * Bump this when the compiler's own logic changes in a way that invalidates
 * existing output — a different blur algorithm, a new manifest field that
 * can't be backfilled, a fix to how dimensions are computed.
 *
 * Sources and config may be untouched, but a mismatch forces a full rebuild.
 * This is the escape hatch that sourceHash and configHash cannot provide.
 */
export const COMPILER_VERSION = 4;

/**
 * Derivative tiers. `width` is the longest-edge budget: images are fitted
 * inside a width×width box, so portrait and landscape both cap at this value
 * on their longest side. Never upscaled.
 *
 * Adding a tier here (e.g. extraLarge: 3500) changes configHash, so the next
 * run generates only the new files and leaves everything else alone.
 */
export const SIZES = {
  thumbnail: { width: 250, quality: 70 },
  small: { width: 800, quality: 80 },
  medium: { width: 1600, quality: 88 },
  large: { width: 2500, quality: 94 },
};

/**
 * The tiny placeholder inlined as a base64 data URI in the manifest and fed to
 * next/image's `placeholder="blur"`. Also written to disk as blur.webp.
 * Kept deliberately tiny — it ships inside the HTML payload of every page.
 */
export const BLUR = { width: 20, quality: 40 };

/**
 * Formats to generate for every tier, in preference order.
 *
 * Default is WebP only: it's what the frontend serves (~97% global support,
 * Safari 14+), and generating unused AVIF/JPEG would triple both compile time
 * and repo size for files nothing requests.
 *
 * Add 'avif' or 'jpeg' here and re-run — configHash changes, so affected
 * images are recompiled and the new files appear alongside the existing ones.
 * (Note AVIF is not always smaller than WebP at these quality levels; measure
 * before assuming it is a win.)
 */
export const FORMATS = ['webp'];

/** Encoder options per format, merged with the tier's `quality`. */
export const ENCODER_OPTIONS = {
  webp: { effort: 4 },
  avif: { effort: 4, chromaSubsampling: '4:4:4' },
  jpeg: { progressive: true, mozjpeg: true },
};

export const EXTENSION_FOR_FORMAT = { webp: 'webp', avif: 'avif', jpeg: 'jpg' };

/** Copy the untouched master into the output tree as `original.<ext>`.
 *
 *  Off by default: nothing on the site offers an original download, and a
 *  30MB master has no business in public/. Flip to true if that changes. */
export const COPY_ORIGINAL = false;

/** Extract EXIF (camera, lens, ISO, exposure, focal length, capture date). */
export const EXTRACT_EXIF = true;

/** Compute the average colour, usable as a flat placeholder. */
export const EXTRACT_DOMINANT_COLOR = true;

/**
 * Move an MP4's `moov` index in front of its media so playback can start
 * before the whole file has arrived ("faststart"). Media bytes are not
 * re-encoded — only the index moves and its offset tables are rewritten.
 * See scripts/images/video.mjs.
 */
export const OPTIMIZE_VIDEO = true;

/**
 * Video codecs every current browser can decode. Anything outside this list is
 * transcoded to H.264.
 *
 * HEVC/H.265 is the one that bites: cameras and phones export it by default,
 * Safari plays it, and Chrome/Firefox on Windows have no decoder at all — so
 * the audio plays, the poster stays up, and it looks like a slow video rather
 * than an unplayable one.
 */
export const BROWSER_SAFE_VIDEO_CODECS = ['avc1', 'avc3', 'vp08', 'vp09', 'av01'];

/**
 * H.264 encode settings. CRF is quality-targeted (lower = better); 20 is
 * visually transparent for this kind of footage. `maxHeight` caps the long
 * edge — a 1080x1920 reel needs no more.
 */
export const VIDEO_ENCODE = { crf: 20, preset: 'slow', maxHeight: 1920, audioBitrate: '160k' };

/**
 * Also publish the untouched original as an extra <source> ahead of the H.264.
 * Safari picks it and gets the better, never-re-encoded file; everyone else
 * falls through to H.264.
 *
 * Costs a second copy of every transcoded video in the repo. Set to false to
 * ship H.264 only and halve that.
 */
export const VIDEO_KEEP_ORIGINAL_SOURCE = true;

/**
 * A video's poster still is the image named `<video-slug>-poster` in the same
 * folder, e.g. reel-1.mp4 → reel-1-poster.jpg. Without one the browser shows
 * a black rectangle until the first frame decodes.
 */
export const POSTER_SUFFIX = '-poster';

/**
 * How the scanner classifies what it finds in assets/originals/.
 *
 * `image`       → full derivative pipeline
 * `passthrough` → copied byte-for-byte, no derivatives (video)
 * `unsupported` → clear, actionable error rather than a sharp crash
 * `ignored`     → skipped silently (sidecars, OS junk)
 * anything else → warned about and skipped
 */
export const ASSET_TYPES = {
  image: ['.jpg', '.jpeg', '.png', '.webp', '.tif', '.tiff', '.avif'],
  passthrough: ['.mp4', '.webm', '.mov'],
  unsupported: {
    '.heic': 'HEIC/HEIF is not supported — sharp ships without libheif. Convert to JPEG or TIFF first.',
    '.heif': 'HEIC/HEIF is not supported — sharp ships without libheif. Convert to JPEG or TIFF first.',
    '.raw': 'Camera RAW is not supported. Export to JPEG or TIFF first.',
    '.cr2': 'Camera RAW is not supported. Export to JPEG or TIFF first.',
    '.nef': 'Camera RAW is not supported. Export to JPEG or TIFF first.',
    '.arw': 'Camera RAW is not supported. Export to JPEG or TIFF first.',
    '.dng': 'Camera RAW is not supported. Export to JPEG or TIFF first.',
  },
};

/** Filenames skipped without comment. `_`-prefixed names are reserved for
 *  sidecar metadata (see the category-metadata roadmap item). */
export const IGNORED_NAMES = ['.ds_store', 'thumbs.db', 'desktop.ini'];

export const PATHS = {
  root,
  originals: path.join(root, 'assets', 'originals'),
  output: path.join(root, 'public', 'images', 'processed'),
  manifest: path.join(root, 'lib', 'generated', 'imagesManifest.json'),
};

/**
 * Public URL prefix the frontend prepends to the relative paths stored in the
 * manifest. The manifest itself never contains absolute URLs — that's what
 * makes moving to a CDN a config change rather than a migration.
 */
export const PUBLIC_BASE_URL =
  process.env.NEXT_PUBLIC_IMAGE_BASE_URL || '/images/processed';

/**
 * Leave one core free so the machine stays usable during a long run, and
 * scale to CI without anyone editing config.
 */
export const CONCURRENCY = Math.max(1, (os.availableParallelism?.() ?? 4) - 1);

/**
 * Everything that affects the *content* of generated files. Hashed into the
 * manifest so a config edit is detected as a change.
 *
 * Deliberately excludes CONCURRENCY and PATHS: how fast we build, and where
 * output lands, don't change the bytes produced.
 */
export const HASHED_CONFIG = {
  SIZES,
  BLUR,
  FORMATS,
  ENCODER_OPTIONS,
  COPY_ORIGINAL,
  EXTRACT_EXIF,
  EXTRACT_DOMINANT_COLOR,
  OPTIMIZE_VIDEO,
  BROWSER_SAFE_VIDEO_CODECS,
  VIDEO_ENCODE,
  VIDEO_KEEP_ORIGINAL_SOURCE,
};
