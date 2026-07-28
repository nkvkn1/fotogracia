import Image from 'next/image';
import Link from 'next/link';

export const metadata = {
  title: 'Services — Luxury Wedding Photography, Executive Portraits & Content',
  description:
    'Editorial wedding photography, portrait sessions, and brand content creation in Toronto. Refined, intentional imagery for couples and professionals.',
  alternates: {
    canonical: 'https://fotogracia.com/services',
  },
};

const services = [
  {
    id: 'weddings',
    index: '01',
    title: 'Weddings & Engagements',
    tagline: 'Bespoke documentary coverage for sophisticated celebrations.',
    description:
      'Every wedding is approached with care, preparation, and a genuine editorial eye. The focus is on natural moments, composed portraits, and the atmosphere of the day — documented thoughtfully rather than performed for the camera. Recent celebrations at Graydon Hall Manor and Catana Estate.',
    includes: [
      'Vero as Lead Photographer · Nishank as Lead Cinematographer',
      'Planning consultation, Wedding Blueprint™ & Personality Profile™',
      'Full-day coverage — 8 to 10 hours depending on collection',
      'Drone coverage (weather & venue permitting)',
      'Professional audio recording & multiple camera coverage',
      'Professionally edited photographs + cinematic wedding film',
      'High-resolution online gallery with print release',
    ],
    note: 'Collections from $4,999 — inclusive of photography and film. To preserve a personalised experience, only a limited number of weddings are accepted each season.',
    src: '/images/weddings/doreen-david-101.jpg',
  },
  {
    id: 'portraits',
    index: '02',
    title: 'Executive Portraits',
    tagline: 'Portrait and personal branding photography for Toronto professionals and executives.',
    description:
      'Portrait sessions are built around the individual — their style, their audience, and what the images need to do. Intentional, editorial, and structured to feel easy on the day.',
    includes: [
      'Pre-session style and brief consultation',
      'Location and environment recommendations',
      '1-hour session — outdoor or curated studio setting',
      '30–60 professionally edited images',
      'Private online gallery with full commercial usage rights',
      'Extended sessions, video content, and high-end retouching available',
    ],
    note: 'Outdoor sessions from $800. Studio sessions from $1,200. Reach out to discuss your needs.',
    src: '/images/portraits/p-05.jpg',
  },
  {
    id: 'content',
    index: '03',
    title: 'Brand Content',
    tagline: 'Refined photo and video for brands and creators who value intentional visual content.',
    description:
      'Photo and video for brands and creators who want content that actually reflects their quality. From product shoots to editorial campaigns to behind-the-scenes reels — made with intention.',
    includes: [
      'Creative brief and visual direction collaboration',
      'Photo and video delivered within a single session',
      'Fully edited deliverables optimised for digital and print',
      'Commercial usage rights',
      'Priority and retainer arrangements available',
    ],
    note: 'Retainer packages available for brands requiring consistent elevated content.',
    src: '/images/content/content-poster.jpg',
  },
];

export default function ServicesPage() {
  return (
    <div className="pt-24">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-6 md:px-10 py-12 md:py-16">
        <p className="label text-muted mb-3">Bespoke Photography Services · Toronto & GTA</p>
        <h1 className="heading-display text-5xl md:text-6xl text-ink">Services.</h1>
      </div>

      {/* Services list */}
      <div className="max-w-7xl mx-auto px-6 md:px-10 pb-24 md:pb-32">
        <div className="divide-y divide-ink/10">
          {services.map((svc) => (
            <div key={svc.id} id={svc.id} className="py-16 md:py-20 scroll-mt-20">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-16">
                {/* Service image */}
                <div className="md:col-span-5 order-2 md:order-1">
                  <Image
                    src={svc.src}
                    alt={svc.title}
                    width={0}
                    height={0}
                    sizes="(max-width: 768px) 100vw, 42vw"
                    className="w-full h-auto"
                  />
                </div>

                {/* Text */}
                <div className="md:col-span-6 md:col-start-7 order-1 md:order-2 flex flex-col justify-center">
                  <div className="flex items-baseline gap-4 mb-4">
                    <span className="label text-muted">{svc.index}</span>
                    <h2 className="heading-display text-4xl md:text-5xl text-ink">{svc.title}</h2>
                  </div>
                  <p className="label text-muted mb-5">{svc.tagline}</p>
                  <p className="text-sm text-ink-light leading-relaxed mb-8">{svc.description}</p>

                  <div className="mb-8">
                    <p className="label text-ink mb-3">What's included</p>
                    <ul className="space-y-2">
                      {svc.includes.map((item) => (
                        <li key={item} className="flex items-start gap-3">
                          <span className="text-muted mt-0.5">—</span>
                          <span className="text-sm text-ink-light">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <p className="label text-muted mb-6">{svc.note}</p>

                  <div className="flex flex-wrap gap-4">
                    <Link
                      href={`/contact?service=${svc.id}`}
                      className="inline-flex items-center justify-center border border-ink text-ink px-8 py-3 label hover:bg-ink hover:text-cream transition-colors"
                    >
                      Inquire About This Service
                    </Link>
                    <Link
                      href={`/work?category=${svc.id === 'portraits' ? 'Portraits' : svc.id === 'weddings' ? 'Weddings' : 'Content'}`}
                      className="inline-flex items-center justify-center text-ink px-8 py-3 label hover:opacity-50 transition-opacity border border-ink/30"
                    >
                      View portfolio →
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ */}
      <section className="bg-cream-dark py-20 px-6 md:px-10">
        <div className="max-w-7xl mx-auto">
          <p className="label text-muted mb-10">Frequently asked</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-4xl">
            {[
              {
                q: 'How far in advance should we inquire?',
                a: 'Wedding dates are typically reserved 9–12 months in advance. To ensure availability for your celebration, early inquiry is strongly recommended. Portrait and content sessions are generally available within a few weeks.',
              },
              {
                q: 'Do you photograph destination weddings?',
                a: 'Yes — Fotogracia is available for destination and international weddings. Travel arrangements are discussed during the consultation, and bespoke packages are tailored accordingly.',
              },
              {
                q: 'When will we receive our images?',
                a: 'A curated preview selection is delivered within 48 hours of your wedding. The complete gallery — fully edited and print-ready — is delivered within 28 days.',
              },
              {
                q: 'What does the experience feel like on the day?',
                a: 'Unobtrusive. Fotogracia operates with complete discretion — your guests will barely notice a photographer is present. The session is guided by observation, not direction.',
              },
            ].map(({ q, a }) => (
              <div key={q}>
                <p className="heading-serif text-lg text-ink mb-2">{q}</p>
                <p className="text-sm text-ink-light leading-relaxed">{a}</p>
              </div>
            ))}
          </div>

          <div className="mt-12">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center border border-ink text-ink px-10 py-4 label hover:bg-ink hover:text-cream transition-colors"
            >
              Begin the Conversation
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
