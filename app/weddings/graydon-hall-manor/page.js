import Image from 'next/image';
import Link from 'next/link';

export const metadata = {
  title: 'Graydon Hall Manor Wedding Photographer | Fotogracia Toronto',
  description:
    'Editorial wedding photography at Graydon Hall Manor, Toronto. Fotogracia has documented celebrations at this iconic manor house — refined, timeless imagery for couples who value the details.',
  alternates: {
    canonical: 'https://fotogracia.com/weddings/graydon-hall-manor',
  },
  openGraph: {
    title: 'Graydon Hall Manor Wedding Photographer | Fotogracia',
    description:
      'Editorial wedding photography at Graydon Hall Manor, Toronto. Recent celebrations documented by Fotogracia — refined imagery, calm approach.',
    url: 'https://fotogracia.com/weddings/graydon-hall-manor',
  },
  keywords: [
    'Graydon Hall Manor wedding photographer',
    'Graydon Hall Manor wedding photography',
    'wedding photographer Graydon Hall Manor Toronto',
    'editorial wedding photographer Graydon Hall Manor',
    'Toronto manor wedding photographer',
  ],
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'Wedding Photography at Graydon Hall Manor',
  provider: {
    '@type': 'LocalBusiness',
    name: 'Fotogracia',
    url: 'https://fotogracia.com',
    address: { '@type': 'PostalAddress', addressLocality: 'Toronto', addressRegion: 'ON', addressCountry: 'CA' },
  },
  areaServed: 'Graydon Hall Manor, Toronto, ON',
  description: 'Editorial wedding photography at Graydon Hall Manor, Toronto. Refined, intentional coverage by Fotogracia.',
  url: 'https://fotogracia.com/weddings/graydon-hall-manor',
};

const galleryImages = [
  { src: '/images/weddings/ryan-alyssa-27.jpg', alt: 'Wedding couple portrait at Graydon Hall Manor — Fotogracia Toronto' },
  { src: '/images/weddings/doreen-david-37.jpg', alt: 'Elegant wedding ceremony at Graydon Hall Manor Toronto' },
  { src: '/images/weddings/ryan-alyssa-45.jpg', alt: 'Golden hour portrait — Graydon Hall Manor wedding photography' },
  { src: '/images/weddings/doreen-david-75.jpg', alt: 'Wedding reception at Graydon Hall Manor — editorial photography' },
  { src: '/images/weddings/ryan-alyssa-51.jpg', alt: 'Couple portrait at Graydon Hall Manor by Fotogracia' },
  { src: '/images/weddings/doreen-david-50.jpg', alt: 'Refined wedding moment at Graydon Hall Manor, Toronto' },
];

const faqs = [
  {
    q: 'Has Fotogracia photographed weddings at Graydon Hall Manor?',
    a: 'Yes — Graydon Hall Manor is one of the Toronto venues where Fotogracia has documented celebrations. The manor offers exceptional natural light, grand architectural details, and beautifully landscaped grounds that lend themselves to editorial wedding imagery.',
  },
  {
    q: 'What are the best photography locations at Graydon Hall Manor?',
    a: 'Graydon Hall Manor offers a number of outstanding settings — the formal English gardens are ideal for couple portraits, the stone manor façade creates a classic architectural backdrop, and the interior staircase and ballroom offer more intimate framing. Golden hour across the grounds is particularly remarkable.',
  },
  {
    q: 'How much does wedding photography at Graydon Hall Manor cost?',
    a: 'Wedding photography at Graydon Hall Manor starts from $4,999, inclusive of a second photographer, venue preparation, drone coverage where permitted, and a curated 48-hour preview gallery — delivered within 24 hours for Collection III couples. Full-day packages and custom collections are available upon enquiry.',
  },
  {
    q: 'Is Fotogracia familiar with a Graydon Hall Manor wedding day?',
    a: 'Yes. Every Fotogracia wedding includes a pre-wedding planning consultation and a custom photography timeline built around your specific venue and day. For Graydon Hall Manor weddings, that means knowing the light, the spaces, and the quiet moments the manor naturally creates — so the day unfolds with less direction and more presence.',
  },
];

export default function GraydonHallManorPage() {
  return (
    <div className="pt-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* ── HEADER ───────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-6 md:px-10 py-12 md:py-16">
        <p className="label text-muted mb-3">Wedding Photography · Graydon Hall Manor, Toronto</p>
        <h1 className="heading-display text-5xl md:text-6xl text-ink">
          Graydon Hall<br />Manor.
        </h1>
      </div>

      {/* ── HERO ─────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-6 md:px-10 pb-16">
        <Image
          src="/images/weddings/ryan-alyssa-27.jpg"
          alt="Wedding photography at Graydon Hall Manor Toronto — Fotogracia"
          width={0}
          height={0}
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
              One of Toronto&apos;s most celebrated wedding venues — and a setting that rewards a calm, editorial approach to photography.
            </h2>
            <Link
              href="/contact?service=weddings&venue=graydon-hall-manor"
              className="inline-flex items-center justify-center border border-ink text-ink px-8 py-3 label hover:bg-ink hover:text-cream transition-colors"
            >
              Inquire About Your Graydon Hall Wedding
            </Link>
          </div>
          <div className="space-y-4 text-sm text-ink-light leading-relaxed">
            <p>
              Graydon Hall Manor sits in North York&apos;s ravine-edged greenspace — a stately English manor house framed by formal gardens, mature trees, and the kind of architecture that makes every frame feel considered. It&apos;s a venue that holds light beautifully and offers a natural variety of settings across the wedding day, from the intimate getting-ready spaces inside to the sweeping exterior grounds as the afternoon softens.
            </p>
            <p>
              Fotogracia has documented celebrations at Graydon Hall Manor and understands the rhythm of a wedding day there — the portrait locations, the movement of light across the gardens, and how to work within the manor&apos;s character rather than against it. That familiarity translates into calmer, more intentional coverage for you.
            </p>
            <p>
              Every Fotogracia wedding at Graydon Hall includes a pre-wedding venue walkthrough and a custom photography timeline, a second photographer, drone coverage where the venue and weather permit, and a curated preview gallery delivered within 48 hours of your celebration — within 24 hours for Collection III couples.
            </p>
          </div>
        </div>
      </section>

      {/* ── GALLERY ──────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-6 md:px-10 pb-24 md:pb-32">
        <p className="label text-muted mb-10">Recent work at Graydon Hall Manor</p>
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 md:gap-6">
          {galleryImages.map(({ src, alt }) => (
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
                body: 'A pre-wedding consultation, custom photography timeline, pre-wedding questionnaire, and venue walkthrough to make sure nothing is left to chance.',
              },
              {
                title: 'Full Coverage',
                body: 'Full-day coverage from 8–10 hours, a second photographer included, complimentary drone coverage (weather and venue permitting), and organised family portraits.',
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
              Wedding photography at Graydon Hall Manor from <strong className="text-ink">$4,999</strong>, inclusive of a second photographer. Custom collections available upon enquiry.
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
          <p className="label text-cream/40 mb-6">Graydon Hall Manor · Limited availability each season</p>
          <h2 className="heading-display text-5xl md:text-6xl text-cream leading-none mb-8">
            Let&apos;s talk about<br />your celebration.
          </h2>
          <p className="text-cream/60 text-sm max-w-sm mx-auto mb-10 leading-relaxed">
            Share your date, venue, and a little about your vision. All enquiries receive a personal response within 48 hours.
          </p>
          <Link
            href="/contact?service=weddings&venue=graydon-hall-manor"
            className="inline-flex items-center justify-center border border-cream text-cream px-10 py-4 label hover:bg-cream hover:text-ink transition-colors"
          >
            Begin the Conversation
          </Link>
        </div>
      </section>
    </div>
  );
}
