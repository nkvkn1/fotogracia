# Fotogracia

Photography website for portraits, weddings & engagements, and content creation.
Built with Next.js 14 + Tailwind CSS. Deploys to Vercel in one click.

---

## Quick start

```bash
npm install
npm run dev
# open http://localhost:3000
```

---

## Deploy to Vercel

1. Push this folder to a GitHub repo
2. Go to [vercel.com](https://vercel.com) → New Project → Import your repo
3. No configuration needed — Vercel auto-detects Next.js
4. Hit Deploy

Custom domain: in Vercel dashboard → Project → Settings → Domains → add `fotogracia.com`

---

## Adding photographs

Photographs are compiled offline. You add originals, run one command, commit
the result — nothing is processed at request time, and you never edit a
filename, a manifest, or a React component to add a photo.

```bash
# 1. Drop originals into a category folder (any filename, any size)
#    assets/originals/weddings/DSC_4821.jpg

# 2. Preview what will happen — writes nothing
npm run publish-images -- --dry-run

# 3. Compile
npm run publish-images

# 4. Commit the generated output
git add public/images/processed lib/generated/imagesManifest.json
git commit -m "Add spring wedding set"
```

Then deploy as usual. That's the whole workflow.

### How it works

`assets/originals/` is the single source of truth. The folder a photograph
sits in becomes its category, and its filename becomes its id:

```
assets/originals/weddings/DSC_4821.jpg   →   id "weddings/dsc-4821"
```

Each original is compiled into a blur placeholder plus four sizes
(thumbnail 250px, small 800px, medium 1600px, large 2500px), written to
`public/images/processed/`, and recorded in
`lib/generated/imagesManifest.json` along with its dimensions, aspect ratio,
dominant colour and EXIF.

Originals are **never modified, resized, or recompressed** — the compiler only
reads them. They are gitignored (they run 20–50MB each), so **keep your own
backup of `assets/originals/`**; it is not stored in the repo.

### Video

Videos go in the same category folders. Drop in whatever your camera or phone
produced — the compiler makes it web-playable:

- **Codec check and transcode.** Phones and cameras export **HEVC/H.265** by
  default. Safari plays it; Chrome and Firefox have no decoder, so the poster
  stays up and only the audio plays — which looks like a slow video rather
  than a broken one, and is easy to miss. The compiler detects this and
  publishes an H.264 rendition alongside the original, ordered so Safari still
  gets the never-re-encoded file. H.264, VP8/VP9 and AV1 are passed through
  untouched. If a video cannot be made playable — ffmpeg missing, or the
  encode fails — **the run fails**; it will not publish a video most visitors
  cannot watch.
- **Faststart remux.** Most encoders write the MP4 index (`moov`) *after* the
  media, so a browser cannot start playing until it has fetched the end of the
  file — on a 34MB reel that means a long black rectangle, or no playback at
  all. The compiler moves the index to the front and rewrites its offset
  tables. The media payload stays bit-identical, and the result is verified
  before it is written; if verification fails the run errors rather than
  shipping a broken video.
- **Poster stills.** Name an image `<video-name>-poster` in the same folder and
  it is wired up automatically:

  ```
  assets/originals/content/reel-1.mp4
  assets/originals/content/reel-1-poster.jpg   →  becomes reel-1's poster
  ```

  Without a poster the tile is blank until the first frame decodes.

Transcoding needs `ffmpeg-static`, a devDependency — it runs at compile time
only and is never shipped to the browser. Encode quality (`crf`), the size cap,
and whether to keep the original as a Safari source live in
`scripts/images/config.mjs`; setting `VIDEO_KEEP_ORIGINAL_SOURCE` to `false`
publishes H.264 only and roughly halves what a transcoded video costs in the
repo.

### Everyday tasks

| To do this | Do this |
|---|---|
| Add photos | Copy into `assets/originals/<category>/`, re-run |
| Remove a photo | Delete the original, re-run — derivatives are cleaned up |
| Rename a photo | Rename the original, re-run — treated as delete + add |
| Add a category | Just make the folder; it's picked up automatically |
| Change sizes/quality/formats | Edit `scripts/images/config.mjs`, re-run |
| Rebuild everything | `npm run publish-images -- --force` |

Re-running with nothing changed does no work and prints
`✓ Everything is up to date.` Only new and modified images are ever processed,
so a run after adding two photos takes seconds, not minutes.

### Using a photograph on a page

Reference the id — never a filename. The component resolves the URL, the real
width and height, and the blur placeholder from the manifest:

```jsx
import ProcessedImage from '@/components/ProcessedImage';

<ProcessedImage
  id="weddings/dsc-4821"
  size="medium"        // thumbnail | small | medium | large
  alt="Bride and groom at Graydon Hall Manor"
  sizes="(max-width: 768px) 100vw, 50vw"
  className="w-full h-auto"
/>
```

Use `large` for full-bleed and hero images, `medium` for half-width content,
`small` for grid cells. Add `fill` for images that should cover a positioned
parent. `alt` is required — it's editorial copy that carries SEO weight and
can't be derived from a filename.

To list a whole category (as `/work` does), query the manifest instead of
hardcoding a list:

```jsx
import { getCategory } from '@/lib/images';

const weddings = getCategory('weddings', { type: 'image' });
```

### When something goes wrong

The command fails loudly rather than shipping broken output. The messages you
are most likely to see:

- **`Filename collision`** — two originals reduce to the same id, e.g.
  `Bride.jpg` and `Bride.jpeg` both become `bride`. Nothing is written until
  you rename one.
- **`HEIC/HEIF is not supported`** — convert to JPEG or TIFF first. Same for
  camera RAW.
- **`Unrecognised file type — skipped`** — a stray non-image in the originals
  folder. Harmless, but worth cleaning up.
- **`Validation failed`** — the output no longer matches the manifest. Rare,
  since a missing derivative is normally detected and rebuilt automatically on
  the next run. If it persists, `npm run publish-images -- --force` rebuilds
  from scratch.

Interrupting a run is safe: finished photographs stay finished, partial output
is discarded, and re-running picks up exactly where it stopped.

### Bumping the compiler version

`COMPILER_VERSION` in `scripts/images/config.mjs` forces a full rebuild when
the compiler's own logic changes in a way that existing output can't reflect —
a different blur algorithm, a new manifest field. Changing sizes, quality or
formats does **not** need it; those are detected automatically.

### Moving to a CDN later

The manifest stores relative paths only, and all output goes through
`scripts/images/target.mjs`. To serve from R2/S3/Vercel Blob: add a target
module implementing `writeAsset` / `removeAsset` / `listAssetIds` / `hasFile`,
set `NEXT_PUBLIC_IMAGE_BASE_URL`, add the host to `remotePatterns` in
`next.config.js`, and gitignore `public/images/processed/`. No page or
component changes.

## Customise

### Update your details

Search for `[Your Name]`, `[Your City]`, and placeholder copy throughout the page files and replace with your real info.

### Wire up the contact form

The form in `app/contact/page.js` POSTs to Formspree by default.
1. Sign up at [formspree.io](https://formspree.io) (free tier works)
2. Create a form and copy your form ID
3. Replace `YOUR_FORM_ID` in `app/contact/page.js`

Alternatively swap in any other form handler (Resend, Netlify Forms, etc.).

### Update social links

Footer.js has placeholder Instagram/TikTok links — update the `href` values.

---

## Site structure

```
/              → Home (hero, services overview, gallery grid, CTA)
/work          → Portfolio with category filter (Portraits / Weddings / Content)
/about         → Bio, philosophy, quick facts
/services      → Detailed service pages with FAQ
/contact       → Booking form + contact info
```

---

## Fonts

The site uses **Cormorant Garamond** (headings) and **Inter** (body) loaded from Google Fonts via CSS. No additional setup required.

---

## Stack

- [Next.js 14](https://nextjs.org) — App Router
- [Tailwind CSS](https://tailwindcss.com)
- [Vercel](https://vercel.com) — hosting
