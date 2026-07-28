import Image from 'next/image';
import Link from 'next/link';

export const metadata = {
  title: "Portrait Photographer Toronto — Executive & Personal Branding | Fotogracia",
  description:
    "Fotogracia offers editorial portrait and personal branding photography for Toronto professionals, founders, and executives. Deliberate, intentional imagery built for impact.",
  alternates: {
    canonical: 'https://fotogracia.com/mens-portrait',
  },
  openGraph: {
    title: "Portrait Photographer Toronto — Fotogracia",
    description:
      "Editorial portrait and personal branding photography for Toronto professionals and executives. Intentional imagery that represents you well.",
    url: 'https://fotogracia.com/mens-portrait',
  },
};

const portraitImages = [
  { src: '/images/portraits/p-01.jpg', alt: "Men's portrait photographer Toronto — executive session by Fotogracia" },
  { src: '/images/portraits/p-04.jpg', alt: "Luxury men's portrait photography Toronto — dark editorial style" },
  { src: '/images/portraits/p-07.jpg', alt: "Personal branding photographer Toronto — professional male portrait" },
  { src: '/images/portraits/p-10.jpg', alt: "Executive portrait photographer Toronto — cinematic business photo" },
  { src: '/images/portraits/p-12.jpg', alt: "Toronto personal branding photography men — founder portrait by Fotogracia" },
  { src: '/images/portraits/p-14.jpg', alt: "Luxury headshot photographer Toronto — editorial men's portrait" },
];

export default function MensPortraitPage() {
  return (
    <div className="pt-24">
      {/* ── HEADER ───────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-6 md:px-10 py-12 md:py-16">
        <p className="label text-muted mb-3">Executive Portrait & Personal Branding · Toronto</p>
        <h1 className="heading-display text-5xl md:text-6xl text-ink">
          Show up right.
        </h1>
      </div>

      {/* ── HERO IMAGE ───────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-6 md:px-10 pb-16">
        <Image
          src="/images/portraits/p-05.jpg"
          alt="Men's portrait photographer Toronto — luxury executive personal branding by Fotogracia"
          width={0}
          height={0}
          sizes="100vw"
          className="w-full h-auto"
          priority
        />
      </div>

      {/* ── PHILOSOPHY ───────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-6 md:px-10 pb-24 md:pb-32">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24 items-start">
          <div>
            <p className="label text-muted mb-6">The approach</p>
            <h2 className="heading-serif text-3xl md:text-4xl text-ink leading-snug mb-8">
              Portrait and personal branding photography for Toronto professionals who want imagery that actually represents them well.
            </h2>
            <div className="space-y-4 text-sm text-ink-light leading-relaxed">
              <p>
                The way you show up visually matters. Whether you&apos;re refreshing your brand presence, stepping into a new role, or simply want photography that feels true to who you are — portrait sessions are designed to be intentional, low-pressure, and genuinely useful.
              </p>
              <p>
                Each session is structured around the individual — their style, their audience, and what they actually need the images to do. The result is photography that works for you beyond the session itself.
              </p>
              <p>
                Based in Toronto and available for outdoor, studio, or on-location sessions.
              </p>
            </div>
            <Link
              href="/contact?service=portraits"
              className="inline-flex items-center justify-center border border-ink text-ink px-8 py-3 label hover:bg-ink hover:text-cream transition-colors mt-10"
            >
              Book a Portrait Session
            </Link>
          </div>

          <div className="space-y-6">
            <div>
              <p className="label text-muted mb-4">What&apos;s included</p>
              <ul className="space-y-3">
                {[
                  'Pre-session style and brief consultation',
                  'Location and environment recommendations',
                  '1-hour session — outdoor or curated studio setting',
                  '30–60 professionally edited images',
                  'Private online gallery with full commercial usage rights',
                  'Extended sessions, video content, and high-end retouching available',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span className="text-muted mt-0.5">—</span>
                    <span className="text-sm text-ink-light">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="border-t border-ink/10 pt-6">
              <p className="label text-muted mb-2">Investment</p>
              <p className="text-sm text-ink-light">
                Outdoor sessions from <strong className="text-ink">$800</strong>. Studio sessions from <strong className="text-ink">$1,200</strong>. Bespoke personal branding packages available upon inquiry.
              </p>
            </div>
            <div className="border-t border-ink/10 pt-6">
              <p className="label text-muted mb-2">Designed for</p>
              <p className="text-sm text-ink-light leading-relaxed">
                C-suite executives, managing partners, founders, real estate principals, creative directors, and professionals whose visual presence demands the same standard as their work.
              </p>
            </div>
            <div className="border-t border-ink/10 pt-6">
              <p className="label text-muted mb-2">The &ldquo;Show Up Right&rdquo; guide</p>
              <p className="text-sm text-ink-light leading-relaxed mb-4">
                A complimentary preparation guide — covering wardrobe, grooming, environment, and mindset — is provided to every client ahead of their session.
              </p>
              <Link
                href="/contact?service=portraits"
                className="label text-ink link-underline hover:opacity-60 transition-opacity text-sm"
              >
                Request your guide →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── GALLERY ──────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-6 md:px-10 pb-24 md:pb-32">
        <p className="label text-muted mb-10">Selected portraits</p>
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 md:gap-6">
          {portraitImages.map(({ src, alt }) => (
            <div key={src} className="break-inside-avoid mb-4 md:mb-6">
              <Image
                src={src}
                alt={alt}
                width={0}
                height={0}
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="w-full h-auto"
              />
            </div>
          ))}
        </div>
        <div className="mt-8 text-center">
          <Link
            href="/work?category=Portraits"
            className="label text-ink link-underline hover:opacity-60 transition-opacity"
          >
            View full portrait portfolio →
          </Link>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────── */}
      <section className="bg-ink text-cream py-24 md:py-32 px-6 md:px-10">
        <div className="max-w-3xl mx-auto text-center">
          <p className="label text-cream/40 mb-6">Portrait sessions · Toronto</p>
          <h2 className="heading-display text-5xl md:text-6xl text-cream leading-none mb-8">
            Intentional imagery<br />for people who care<br />how they&apos;re seen.
          </h2>
          <p className="text-cream/60 text-sm max-w-sm mx-auto mb-10 leading-relaxed">
            Sessions are typically available within a few weeks. Reach out and expect a response within 48 hours.
          </p>
          <Link
            href="/contact?service=portraits"
            className="inline-flex items-center justify-center border border-cream text-cream px-10 py-4 label hover:bg-cream hover:text-ink transition-colors"
          >
            Book a Portrait Session
          </Link>
        </div>
      </section>
    </div>
  );
}
