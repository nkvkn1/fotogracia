/**
 * Cleanup — bring the target back in line with the manifest.
 *
 * Two distinct jobs, both of which have to happen for a delete or rename to
 * actually take effect rather than leaving files behind forever:
 *
 *   1. assets whose original is gone       → the manifest already dropped them
 *   2. directories the manifest never knew → orphans from a botched run, a
 *                                            hand-edit, or an older config
 */

export async function cleanup({ target, manifestIds, deletedIds, dryRun }) {
  const removed = [];
  const orphans = [];

  for (const id of deletedIds) {
    if (!dryRun) await target.removeAsset(id);
    removed.push(id);
  }

  const known = new Set(manifestIds);
  for (const id of await target.listAssetIds()) {
    if (known.has(id)) continue;
    if (!dryRun) await target.removeAsset(id);
    orphans.push(id);
  }

  return { removed, orphans };
}
