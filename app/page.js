import Image from 'next/image';
import Link from 'next/link';

export const metadata = {
  title: 'Editorial Wedding Photographer Toronto | Fotogracia',
  description:
    'Fotogracia is a Toronto-based editorial wedding photographer documenting elegant celebrations across the GTA. Refined imagery for couples who value thoughtful, timeless photography.',
  alternates: {
    canonical: 'https://fotogracia.com',
  },
};

export default function Home() {
  return (
    <>
      {/* ── HERO ─────────────────────────────────────────── */}
      <section className="relative min-h-screen flex flex-col">
        <div className="absolute inset-0 overflow-hidden">
          <Image
            src="/images/weddings/doreen-david-101.jpg"
            alt="Editorial wedding photography Toronto — elegant couple portrait by Fotogracia"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/65" />
        </div>

        <div className="relative z-10 mt-auto px-6 md:px-10 pb-16 md:pb-20 max-w-4xl">
          <p className="label text-cream/60 mb-4">Editorial Wedding Photography · Toronto & GTA</p>
          <h1 className="heading-display text-5xl md:text-7xl lg:text-8xl text-cream leading-none">
            Refined wedding<br />
            photography.
          </h1>
          <p className="text-cream/70 text-sm mt-6 max-w-sm leading-relaxed">
            Thoughtfully crafted imagery for couples celebrating meaningful moments in extraordinary settings across Toronto and the GTA.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4">
            <Link
              href="/weddings"
              className="inline-flex items-center justify-center border border-cream text-cream px-8 py-3 label hover:bg-cream hover:text-ink transition-colors"
            >
              View Weddings
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center text-cream px-8 py-3 label hover:opacity-50 transition-opacity"
            >
              Begin the Conversation →
            </Link>
          </div>
        </div>

        <div className="absolute bottom-6 right-6 md:right-10 flex flex-col items-center gap-2">
          <div className="w-px h-12 bg-cream/30" />
        </div>
      </section>

      {/* ── INTRO ────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-6 md:px-10 py-24 md:py-32">
        <div className="max-w-xl">
          <p className="label text-muted mb-6">The work</p>
          <h2 className="heading-serif text-3xl md:text-4xl text-ink leading-snug">
            Editorial wedding photography for elegant celebrations across Toronto and the GTA — documenting each moment with calm intention and a refined artistic eye.
          </h2>
          <p className="text-sm text-muted mt-5 leading-relaxed max-w-md">
            Recent celebrations photographed at Graydon Hall Manor and Catana Estate.
          </p>
          <Link
            href="/weddings"
            className="inline-block label text-ink mt-8 link-underline hover:opacity-60 transition-opacity"
          >
            Explore wedding photography →
          </Link>
        </div>
      </section>

      {/* ── SERVICES GRID ────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-6 md:px-10 pb-24 md:pb-32">
        <p className="label text-muted mb-10">Services</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              title: 'Weddings & Engagements',
              desc: 'Full-day editorial coverage for couples who value thoughtful imagery, natural moments, and a calm, composed experience from start to finish.',
              href: '/weddings',
              src: '/images/weddings/ryan-alyssa-46.jpg',
              alt: 'Editorial wedding photographer Toronto — elegant couple portrait by Fotogracia',
            },
            {
              title: 'Portrait Sessions',
              desc: 'Executive portrait and personal branding photography for founders, professionals, and individuals. Deliberate, intentional imagery built to represent you well.',
              href: '/mens-portrait',
              src: '/images/portraits/p-05.jpg',
              alt: "Portrait photographer Toronto — personal branding session by Fotogracia",
            },
            {
              title: 'Content Creation',
              desc: 'Refined photo and video for brands and creators who value elevated, intentional visual content over generic stock-style imagery.',
              href: '/services#content',
              src: '/images/content/content-poster.jpg',
              alt: 'Brand content creation Toronto — editorial photography and video by Fotogracia',
            },
          ].map(({ title, desc, href, src, alt }) => (
            <Link key={title} href={href} className="group block">
              <Image
                src={src}
                alt={alt}
                width={0}
                height={0}
                sizes="(max-width: 768px) 100vw, 33vw"
                className="w-full h-auto"
              />
              <div className="mt-5">
                <h3 className="heading-serif text-2xl text-ink group-hover:opacity-60 transition-opacity">
                  {title}
                </h3>
                <p className="text-sm text-muted mt-2 leading-relaxed">{desc}</p>
                <span className="label text-ink mt-3 inline-block link-underline">
                  Learn more →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── SELECTED WORK ────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-6 md:px-10 pb-24 md:pb-32">
        <div className="flex items-end justify-between mb-10">
          <p className="label text-muted">Selected work</p>
          <Link href="/work" className="label text-ink link-underline hover:opacity-60 transition-opacity">
            View portfolio →
          </Link>
        </div>

        <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 md:gap-6">
          {[
            { src: '/images/weddings/ryan-alyssa-12.jpg',  alt: 'Editorial wedding photography Toronto — Ryan and Alyssa by Fotogracia' },
            { src: '/images/portraits/p-09.jpg', alt: 'Portrait session Toronto — personal branding photography by Fotogracia' },
            { src: '/images/weddings/doreen-david-30.jpg',  alt: 'Toronto wedding photographer — Doreen and David by Fotogracia' },
            { src: '/images/weddings/ryan-alyssa-51.jpg',  alt: 'GTA wedding photographer — editorial wedding photography by Fotogracia' },
            { src: '/images/portraits/p-02.jpg', alt: 'Executive portrait photographer Toronto — personal branding by Fotogracia' },
            { src: '/images/weddings/doreen-david-74.jpg',  alt: 'Elegant wedding photography Toronto GTA — editorial portrait by Fotogracia' },
          ].map(({ src, alt }) => (
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
      </section>

      {/* ── TESTIMONIAL ──────────────────────────────────── */}
      <section className="bg-ink text-cream py-24 md:py-32 px-6 md:px-10">
        <div className="max-w-3xl mx-auto text-center">
          <p className="label text-cream/40 mb-8">Kind words</p>
          <blockquote className="heading-serif text-2xl md:text-3xl leading-snug text-cream/90">
            &ldquo;The experience was calm and completely professional from the moment we connected. The photos are everything we hoped for — and then some.&rdquo;
          </blockquote>
          <p className="label text-cream/40 mt-8">— Wedding client, Graydon Hall Manor</p>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-6 md:px-10 py-24 md:py-32 text-center">
        <p className="label text-muted mb-6">To preserve a thoughtful and personalised experience, Fotogracia accepts a limited number of weddings each season.</p>
        <h2 className="heading-display text-5xl md:text-6xl lg:text-7xl text-ink leading-none mb-10">
          Let&apos;s talk about<br />your celebration.
        </h2>
        <Link
          href="/contact"
          className="inline-flex items-center justify-center border border-ink text-ink px-10 py-4 label hover:bg-ink hover:text-cream transition-colors"
        >
          Inquire About Your Celebration
        </Link>
      </section>
    </>
  );
}
