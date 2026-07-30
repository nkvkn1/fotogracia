/**
 * Read access to the compiled image manifest.
 *
 * The manifest is a plain JSON import, so every lookup here is resolved at
 * build time and bundled — no filesystem access, no fetch, no runtime image
 * processing. Nothing in the app should reference an image filename directly;
 * ask for an id instead and let this module resolve the rest.
 *
 * Regenerate with `npm run publish-images` after changing assets/originals/.
 */

import manifest from './generated/imagesManifest.json';

/** Tier names and widths, echoed from the compiler config at build time. */
export const SIZES = manifest.sizes ?? {};
export const SIZE_NAMES = Object.keys(SIZES);
export const FORMATS = manifest.formats ?? ['webp'];

/**
 * Where derivatives are served from. The manifest stores relative paths only,
 * so pointing this at a CDN is the whole migration — set
 * NEXT_PUBLIC_IMAGE_BASE_URL and rebuild. The env var wins over the value
 * baked in at compile time so switching doesn't require recompiling assets.
 */
export const BASE_URL =
  process.env.NEXT_PUBLIC_IMAGE_BASE_URL || manifest.baseUrl || '/images/processed';

const stripTrailing = (s) => s.replace(/\/+$/, '');

/**
 * Turn a manifest-relative path into a URL the browser can request.
 *
 * Derivative filenames are stable — "small.webp" stays "small.webp" when the
 * photograph behind it changes — so a content version is appended as a query
 * string. That is what makes the immutable cache headers in next.config.js
 * safe: replacing a photograph changes the URL, so caches can't serve the old
 * one, while the filenames in git stay put.
 */
export function toUrl(relativePath, version) {
  const url = `${stripTrailing(BASE_URL)}/${relativePath}`;
  return version ? `${url}?v=${version.slice(-8)}` : url;
}

/**
 * Look up one asset.
 * @throws if the id is unknown — a typo should fail the build loudly rather
 *         than ship a broken <img> to a client's portfolio.
 */
export function getImage(id) {
  const record = manifest.images[id];
  if (!record) {
    const known = Object.keys(manifest.images);
    const near = known.filter((k) => k.includes(id) || id.includes(k)).slice(0, 3);
    throw new Error(
      `Unknown image id "${id}". ` +
        (near.length ? `Did you mean: ${near.join(', ')}? ` : '') +
        `Add the file to assets/originals/ and run \`npm run publish-images\`. ` +
        `(${known.length} images available.)`
    );
  }
  return record;
}

export function hasImage(id) {
  return Boolean(manifest.images[id]);
}

/**
 * Resolve everything a next/image needs for one asset at one tier.
 * Falls back to the largest available tier if the requested one is absent,
 * so adding a tier to config.mjs can never break a page before assets are
 * recompiled.
 */
export function getImageSource(id, size = 'medium') {
  const record = getImage(id);
  if (record.type !== 'image') {
    throw new Error(`"${id}" is a ${record.type}, not an image — use getAsset() instead.`);
  }

  const tier = record.derivatives[size] ?? record.derivatives[SIZE_NAMES.at(-1)];
  const format = FORMATS.find((f) => tier?.[f]) ?? 'webp';

  return {
    src: toUrl(tier[format], record.sourceHash),
    width: tier.width,
    height: tier.height,
    blurDataURL: record.blurDataURL,
    dominantColor: record.dominantColor,
    // Intrinsic dimensions of the master, for aspect-ratio boxes that should
    // not depend on which tier happens to be rendered.
    intrinsicWidth: record.width,
    intrinsicHeight: record.height,
    aspectRatio: record.aspectRatio,
  };
}

/**
 * Any asset, image or video, with its URLs resolved.
 *
 * For video this also resolves the poster still, so a player has something to
 * show before the first frame decodes instead of a black rectangle.
 */
export function getAsset(id) {
  const record = getImage(id);
  return {
    ...record,
    url: record.file ? toUrl(record.file, record.sourceHash) : null,
    posterUrl: record.poster ? getImageSource(record.poster, 'small').src : null,
    // Ordered best-first: a browser picks the first source it can decode, so
    // Safari gets the never-re-encoded original and everyone else falls
    // through to H.264. Each carries an explicit codec in its MIME type —
    // without that, a browser would pick a file it cannot actually play.
    sources: (record.sources ?? []).map((s) => ({
      src: toUrl(s.file, record.sourceHash),
      type: s.mimeType,
    })),
  };
}

/**
 * Every asset in a category, e.g. "weddings". Sorted by id so the gallery
 * order is stable across machines and rebuilds rather than depending on
 * filesystem enumeration order.
 */
export function getCategory(category, { type } = {}) {
  return Object.values(manifest.images)
    .filter((r) => r.category === category && (!type || r.type === type))
    .sort((a, b) => a.id.localeCompare(b.id, undefined, { numeric: true }));
}

export function getCategories() {
  return [...new Set(Object.values(manifest.images).map((r) => r.category))].sort();
}

export const imageCount = manifest.count;
