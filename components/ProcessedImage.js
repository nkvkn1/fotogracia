import Image from 'next/image';

import { getImageSource } from '@/lib/images';

/**
 * Renders a compiled image by id.
 *
 * Pages never name a file — they name an asset and a size, and the manifest
 * supplies the URL, the intrinsic dimensions and the blur placeholder. The
 * dimensions matter: passing real values is what stops the layout jolting as
 * each photograph loads.
 *
 *   <ProcessedImage id="weddings/doreen-david-101" size="small" alt="…" />
 *
 * `alt` stays the caller's job. It is editorial copy that carries real SEO
 * weight and cannot be derived from a filename.
 *
 * @param {string} id     manifest id, e.g. "weddings/doreen-david-101"
 * @param {string} size   tier name from scripts/images/config.mjs
 * @param {string} alt    required; pass "" only for decorative images
 * @param {boolean} fill  fill the positioned parent instead of using intrinsic size
 */
export default function ProcessedImage({
  id,
  size = 'medium',
  alt,
  fill = false,
  className,
  sizes,
  priority = false,
  quality,
  style,
  ...rest
}) {
  const source = getImageSource(id, size);

  if (alt === undefined) {
    throw new Error(
      `<ProcessedImage id="${id}"> is missing \`alt\`. ` +
        `Pass descriptive text, or alt="" if the image is purely decorative.`
    );
  }

  const common = {
    src: source.src,
    alt,
    placeholder: 'blur',
    blurDataURL: source.blurDataURL,
    priority,
    sizes,
    quality,
    className,
    ...rest,
  };

  if (fill) {
    return <Image {...common} fill style={style} />;
  }

  return (
    <Image {...common} width={source.width} height={source.height} style={style} />
  );
}
