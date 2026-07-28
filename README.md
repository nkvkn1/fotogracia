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

## Customise

### Replace placeholder images

Every `photo-placeholder` div is a grey slot waiting for a real image.
To swap one in, replace the div with a Next.js `<Image>` tag:

```jsx
import Image from 'next/image';

// Before
<div className="photo-placeholder aspect-[3/4] w-full" />

// After
<Image
  src="/images/my-photo.jpg"   // put files in /public/images/
  alt="describe the photo"
  fill
  className="object-cover"
/>
// wrap in: <div className="relative aspect-[3/4] w-full overflow-hidden">
```

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
