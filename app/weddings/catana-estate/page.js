import ProcessedImage from '@/components/ProcessedImage';
import Link from 'next/link';

export const metadata = {
  title: 'Catana Estate Wedding Photographer | Fotogracia Toronto',
  description:
    'Editorial wedding photography at Catana Estate, Toronto. Fotogracia has documented celebrations at this elegant estate venue — refined, timeless imagery in a beautifully composed setting.',
  alternates: {
    canonical: 'https://fotogracia.com/weddings/catana-estate',
  },
  openGraph: {
    title: 'Catana Estate Wedding Photographer | Fotogracia',
    description:
      'Editorial wedding photography at Catana Estate, Toronto. Refined, intentional coverage by Fotogracia — recent celebrations documented at this elegant estate.',
    url: 'https://fotogracia.com/weddings/catana-estate',
  },
  keywords: [
    'Catana Estate wedding photographer',
    'Catana Estate wedding photography',
    'wedding photographer Catana Estate Toronto',
    'editorial wedding photographer Catana Estate',
    'Toronto estate wedding photographer',
  ],
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'Wedding Photography at Catana Estate',
  provider: {
    '@type': 'LocalBusiness',
    name: 'Fotogracia',
    url: 'https://fotogracia.com',
    address: { '@type': 'PostalAddress', addressLocality: 'Toronto', addressRegion: 'ON', addressCountry: 'CA' },
  },
  areaServed: 'Catana Estate, Toronto, ON',
  description: 'Editorial wedding photography at Catana Estate, Toronto. Refined, intentional coverage by Fotogracia.',
  url: 'https://fotogracia.com/weddings/catana-estate',
};

const galleryImages = [
  { id: 'weddings/doreen-david-24', alt: 'Wedding photography at Catana Estate Toronto — Fotogracia' },
  { id: 'weddings/ryan-alyssa-37', alt: 'Elegant estate wedding photography at Catana Estate' },
  { id: 'weddings/doreen-david-83', alt: 'Couple portrait at Catana Estate — editorial wedding photographer' },
  { id: 'weddings/ryan-alyssa-60', alt: 'Natural light wedding moment at Catana Estate by Fotogracia' },
  { id: 'weddings/doreen-david-98', alt: 'Wedding reception at Catana Estate Toronto' },
  { id: 'weddings/doreen-david-60', alt: 'Refined estate wedding photography — Catana Estate Toronto' },
];

const faqs = [
  {
    q: 'Has Fotogracia photographed weddings at Catana Estate?',
    a: 'Yes — Catana Estate is one of the venues where Fotogracia has documented celebrations. The estate setting offers a distinctive combination of elegance and natural environment, lending itself to intimate couple portraits and beautifully composed ceremony and reception coverage.',
  },
  {
    q: 'What makes Catana Estate special for wedding photography?',
    a: 'Catana Estate combines a refined venue aesthetic with natural surroundings — creating a setting that balances intimacy and grandeur. The grounds offer excellent portrait opportunities throughout the day, and the estate architecture provides a natural backdrop that elevates editorial photography without needing much additional styling.',
  },
  {
    q: 'How much does wedding photography at Catana Estate cost?',
    a: 'Wedding photography at Catana Estate starts from $4,999, inclusive of a second photographer, a custom photography timeline, drone coverage where the venue and weather permit, and a curated preview gallery within 48 hours of your celebration — within 24 hours for Collection III couples.',
  },
  {
    q: 'What does the Fotogracia planning process look like for a Catana Estate wedding?',
    a: 'Before your wedding, a planning consultation is held to build a photography timeline specific to Catana Estate — including the best portrait windows, light conditions, and the quieter moments the venue naturally creates. A pre-wedding questionnaire ensures every detail is accounted for well in advance.',
  },
];

export default function CatanaEstatePage() {
  return (
    <div className="pt-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* ── HEADER ───────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-6 md:px-10 py-12 md:py-16">
        <p className="label text-muted mb-3">Wedding Photography · Catana Estate, Toronto</p>
        <h1 className="heading-display text-5xl md:text-6xl text-ink">
          Catana Estate.
        </h1>
      </div>

      {/* ── HERO ─────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-6 md:px-10 pb-16">
        <ProcessedImage
          id="weddings/doreen-david-24"
          size="large"
          alt="Wedding photography at Catana Estate Toronto — Fotogracia"
          sizes="100vw"
          className="w-full h-auto"
          priority
        />
      </div>

      {/* ── INTRO ────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-6 md:px-10 pb-24 md:pb-32">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24 items-start">
          <div>
            <p className="label text-muted mb-6">The venue</p>
            <h2 className="heading-serif text-3xl md:text-4xl text-ink leading-snug mb-8">
              An elegant estate setting that holds atmosphere beautifully — and rewards photography that takes its time.
            </h2>
            <Link
              href="/contact?service=weddings&venue=catana-estate"
              className="inline-flex items-center justify-center border border-ink text-ink px-8 py-3 label hover:bg-ink hover:text-cream transition-colors"
            >
              Inquire About Your Catana Estate Wedding
            </Link>
          </div>
          <div className="space-y-4 text-sm text-ink-light leading-relaxed">
            <p>
              Catana Estate offers the kind of setting where the photography almost finds itself — refined architecture, natural grounds, and an atmosphere that feels considered at every turn. It&apos;s a venue well-suited to an editorial approach: one that favours observation over orchestration, and lets the environment do much of the work.
            </p>
            <p>
              Fotogracia has documented celebrations at Catana Estate and understands how to move through the day there — when to step back and let moments unfold, and when to gently guide a couple toward the light or a setting that will serve the imagery well. That familiarity means the day feels calmer and the photography feels more natural.
            </p>
            <p>
              Coverage at Catana Estate includes a pre-wedding planning consultation and custom photography timeline, a second photographer, drone coverage where conditions and venue policies allow, and a curated preview gallery within 48 hours of your wedding — within 24 hours for Collection III couples.
            </p>
          </div>
        </div>
      </section>

      {/* ── GALLERY ──────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-6 md:px-10 pb-24 md:pb-32">
        <p className="label text-muted mb-10">Recent work at Catana Estate</p>
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 md:gap-6">
          {galleryImages.map(({ id, alt }) => (
            <div key={id} className="break-inside-avoid mb-4 md:mb-6">
              <ProcessedImage
                id={id}
                size="small"
                alt={alt}
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="w-full h-auto"
              />
            </div>
          ))}
        </div>
        <div className="mt-8 text-center">
          <Link
            href="/work?category=Weddings"
            className="label text-ink link-underline hover:opacity-60 transition-opacity"
          >
            View full wedding portfolio →
          </Link>
        </div>
      </section>

      {/* ── WHAT'S INCLUDED ──────────────────────────────── */}
      <section className="bg-cream-dark py-20 px-6 md:px-10">
        <div className="max-w-7xl mx-auto">
          <p className="label text-muted mb-10">What&apos;s included</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              {
                title: 'Planning & Preparation',
                body: 'A pre-wedding consultation, custom photography timeline built around Catana Estate, pre-wedding questionnaire, and venue preparation to make sure the day is photographed at its best.',
              },
              {
                title: 'Full Coverage',
                body: 'Full-day coverage from 8–10 hours, a second photographer included, complimentary drone coverage (weather and venue permitting), and organised family portraits on the day.',
              },
              {
                title: 'Delivery',
                body: 'A curated preview gallery within 48 hours (24 hours with Collection III), 300+ edited high-resolution images, and your complete private gallery delivered within 4–6 weeks.',
              },
            ].map(({ title, body }) => (
              <div key={title}>
                <h3 className="heading-serif text-xl text-ink mb-3">{title}</h3>
                <p className="text-sm text-ink-light leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
          <div className="border-t border-ink/10 mt-10 pt-8">
            <p className="text-sm text-ink-light">
              Wedding photography at Catana Estate from <strong className="text-ink">$4,999</strong>, inclusive of a second photographer. Custom collections available upon enquiry.
            </p>
          </div>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-6 md:px-10 py-20 md:py-24">
        <p className="label text-muted mb-10">Frequently asked</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16">
          {faqs.map(({ q, a }) => (
            <div key={q}>
              <h3 className="heading-serif text-lg text-ink mb-3">{q}</h3>
              <p className="text-sm text-ink-light leading-relaxed">{a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────── */}
      <section className="bg-ink text-cream py-24 md:py-32 px-6 md:px-10">
        <div className="max-w-3xl mx-auto text-center">
          <p className="label text-cream/40 mb-6">Catana Estate · Limited availability each season</p>
          <h2 className="heading-display text-5xl md:text-6xl text-cream leading-none mb-8">
            Let&apos;s talk about<br />your celebration.
          </h2>
          <p className="text-cream/60 text-sm max-w-sm mx-auto mb-10 leading-relaxed">
            Share your date, venue, and a little about your vision. All enquiries receive a personal response within 48 hours.
          </p>
          <Link
            href="/contact?service=weddings&venue=catana-estate"
            className="inline-flex items-center justify-center border border-cream text-cream px-10 py-4 label hover:bg-cream hover:text-ink transition-colors"
          >
            Begin the Conversation
          </Link>
        </div>
      </section>
    </div>
  );
}
