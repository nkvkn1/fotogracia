import Image from 'next/image';
import Link from 'next/link';

export const metadata = {
  title: 'Toronto Editorial Wedding Photography | Fotogracia',
  description:
    'Editorial wedding photography for elegant Toronto and GTA celebrations. Refined, intentional coverage with a calm approach — recent work at Graydon Hall Manor and Catana Estate.',
  alternates: {
    canonical: 'https://fotogracia.com/weddings',
  },
  openGraph: {
    title: 'Toronto Editorial Wedding Photography | Fotogracia',
    description:
      'Refined, editorial wedding photography for elegant celebrations across Toronto and the GTA. Recent work at Graydon Hall Manor and Catana Estate.',
    url: 'https://fotogracia.com/weddings',
  },
};

const weddingImages = [
  { src: '/images/weddings/ryan-alyssa-27.jpg', alt: 'Wedding couple portrait — editorial wedding photography Toronto by Fotogracia' },
  { src: '/images/weddings/doreen-david-37.jpg', alt: 'Bride and groom at Graydon Hall Manor — Fotogracia' },
  { src: '/images/weddings/ryan-alyssa-13.jpg', alt: 'Wedding ceremony moment — Toronto editorial wedding photographer' },
  { src: '/images/weddings/doreen-david-50.jpg', alt: 'Elegant wedding reception — refined wedding photography Toronto' },
  { src: '/images/weddings/ryan-alyssa-45.jpg', alt: 'Couple portrait golden hour — GTA wedding photographer' },
  { src: '/images/weddings/doreen-david-75.jpg', alt: 'Wedding detail shot — editorial wedding photography by Fotogracia' },
  { src: '/images/weddings/ryan-alyssa-51.jpg', alt: 'Natural wedding moment — Toronto wedding photographer' },
  { src: '/images/weddings/doreen-david-98.jpg', alt: 'Wedding celebration — Catana Estate editorial photographer' },
  { src: '/images/weddings/doreen-david-60.jpg', alt: 'Refined wedding portrait — GTA editorial wedding photography' },
];

const experience = [
  {
    num: '01',
    title: 'The Consultation',
    body: 'Every wedding begins with a conversation — unhurried and without obligation. We talk through your vision, your venue, and the overall feel you want from your imagery. This is where we make sure the approach is the right fit.',
  },
  {
    num: '02',
    title: 'Planning Support',
    body: 'Once confirmed, I become a calm resource in your planning process. I help with timeline structuring, offer guidance on light and location, coordinate with your planner where needed, and send a pre-wedding questionnaire to make sure nothing is overlooked.',
  },
  {
    num: '03',
    title: 'The Wedding Day',
    body: 'I arrive prepared, stay composed, and work quietly alongside your day as it unfolds. Family portraits are organised efficiently. Couple portraits are guided with gentle direction. Everything else is observed and documented as it happens.',
  },
  {
    num: '04',
    title: 'Your Gallery',
    body: 'A curated sneak peek arrives within 48 hours — within 24 hours with Collection III. Your complete gallery and cinematic film are delivered within 4–6 weeks, beautifully edited and ready to revisit for a lifetime.',
  },
];

export default function WeddingsPage() {
  return (
    <div className="pt-24">
      {/* ── HEADER ───────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-6 md:px-10 py-12 md:py-16">
        <p className="label text-muted mb-3">Editorial Wedding Photography · Toronto & GTA</p>
        <h1 className="heading-display text-5xl md:text-6xl text-ink">
          Weddings.
        </h1>
      </div>

      {/* ── HERO IMAGE ───────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-6 md:px-10 pb-16">
        <Image
          src="/images/weddings/ryan-alyssa-27.jpg"
          alt="Editorial wedding photographer Toronto — elegant couple portrait by Fotogracia"
          width={0}
          height={0}
          sizes="100vw"
          className="w-full h-auto"
          priority
        />
      </div>

      {/* ── INTRO & WHAT YOU RECEIVE ─────────────────────── */}
      <section className="max-w-7xl mx-auto px-6 md:px-10 pb-24 md:pb-32">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24 items-start">
          <div>
            <p className="label text-muted mb-6">The approach</p>
            <h2 className="heading-serif text-3xl md:text-4xl text-ink leading-snug mb-8">
              For couples who value timeless imagery, thoughtful direction, and a refined photography experience from start to finish.
            </h2>
            <div className="space-y-4 text-sm text-ink-light leading-relaxed">
              <p>
                Fotogracia documents weddings with a calm, editorial approach — balancing carefully guided couple portraits, natural family moments, and unscripted atmosphere. The goal is imagery that feels true to the day: composed and intentional, without feeling staged or manufactured.
              </p>
              <p>
                The approach draws from documentary and editorial photography traditions. Every frame is considered — in terms of light, context, and emotion — rather than ticked off a standardised shot list.
              </p>
              <p>
                To preserve a thoughtful and personalised experience, Fotogracia accepts a limited number of weddings each season. If your date is approaching, early enquiry is encouraged.
              </p>
            </div>
            <Link
              href="/contact?service=weddings"
              className="inline-flex items-center justify-center border border-ink text-ink px-8 py-3 label hover:bg-ink hover:text-cream transition-colors mt-10"
            >
              Inquire About Your Celebration
            </Link>
          </div>

          <div className="space-y-0">
            <p className="label text-muted mb-6">Collections</p>
            {[
              { name: 'I — The Signature Experience', price: 'From $4,999', note: 'Photo + film · Up to 8 hours coverage' },
              { name: 'II — The Grand Experience ⭐', price: 'From $6,499', note: 'Most popular · Engagement session included' },
              { name: 'III — The Legacy Experience', price: 'From $8,999', note: 'The complete Fotogracia experience' },
            ].map((col, i) => (
              <div key={col.name} className={`py-5 ${i > 0 ? 'border-t border-ink/10' : ''}`}>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="label text-ink mb-1">{col.name}</p>
                    <p className="text-xs text-muted leading-relaxed">{col.note}</p>
                  </div>
                  <p className="label text-ink whitespace-nowrap">{col.price}</p>
                </div>
              </div>
            ))}
            <div className="border-t border-ink/10 pt-5">
              <a href="#collections" className="label text-ink text-sm link-underline hover:opacity-60 transition-opacity">
                View full collection details →
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── EXPERIENCE / PROCESS ─────────────────────────── */}
      <section className="bg-cream-dark py-20 px-6 md:px-10">
        <div className="max-w-7xl mx-auto">
          <p className="label text-muted mb-10">The experience</p>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
            {experience.map(({ num, title, body }) => (
              <div key={num}>
                <p className="label text-muted mb-3">{num}</p>
                <h3 className="heading-serif text-xl text-ink mb-3">{title}</h3>
                <p className="text-sm text-ink-light leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── THE FOTOGRACIA EXPERIENCE ────────────────────── */}
      <section className="max-w-7xl mx-auto px-6 md:px-10 py-20 md:py-28">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24 items-start">
          <div>
            <p className="label text-muted mb-6">The Fotogracia experience</p>
            <h2 className="heading-serif text-3xl md:text-4xl text-ink leading-snug">
              More than photography coverage — a seamless experience from inquiry through gallery delivery.
            </h2>
          </div>
          <div className="space-y-6 text-sm text-ink-light leading-relaxed">
            <p>
              From the moment you enquire, the process is designed around one thing: making sure your wedding day is documented beautifully, calmly, and completely. Before the wedding, we sit down together for a photography planning consultation — an unhurried conversation about your vision, your venue, and the moments that matter most to you. Together, we build a photography timeline that weaves naturally through your day, from getting-ready moments and the first look, through to family portraits, couple portraits, golden hour, and reception coverage. Nothing is rushed; everything is considered.
            </p>
            <p>
              Before your wedding, time is taken to understand your venue — its light, its best angles, and the portrait opportunities it offers throughout the day. Whether you&apos;re celebrating at an estate, a hotel ballroom, or an intimate garden setting, the environment is photographed at its very best. Whenever weather conditions, venue restrictions, and regulations allow, aerial drone coverage is included at no additional charge — adding an elevated perspective to your gallery that ground-level photography simply cannot replicate.
            </p>
            <p>
              Within 48 hours of your wedding, a curated sneak peek arrives in your inbox — a carefully chosen selection of images so you can begin reliving the day and sharing the news with family who couldn&apos;t wait. For collections that include a wedding film, a beautifully edited 48-hour vertical teaser is delivered alongside it — a short highlight piece designed for sharing while your full film is in post-production. Collection III couples receive their sneak peek within 24 hours.
            </p>
            <p>
              The complete gallery and cinematic wedding film are delivered within 4–6 weeks: carefully edited, thoughtfully curated, and high-resolution — designed to preserve the atmosphere, emotion, and detail of your celebration exactly as it unfolded. Every image and every frame is considered with the same intention as the day it was taken.
            </p>
          </div>
        </div>
      </section>

      {/* ── COLLECTIONS ──────────────────────────────────── */}
      <section id="collections" className="bg-cream-dark py-20 md:py-28 px-6 md:px-10">
        <div className="max-w-7xl mx-auto">
          <p className="label text-muted mb-10">Wedding collections</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

            {/* Collection I */}
            <div className="bg-cream p-8 flex flex-col">
              <p className="label text-muted mb-1">Collection I</p>
              <h3 className="heading-serif text-2xl text-ink mb-1">The Signature Experience</h3>
              <p className="heading-display text-3xl text-ink mb-5">From $4,999</p>
              <p className="text-sm text-ink-light leading-relaxed mb-8">A beautifully curated wedding photography and film experience for couples who value timeless imagery and effortless storytelling.</p>
              {[
                { label: 'Before the Wedding', items: ['Initial consultation', 'Timeline planning assistance', 'Personality Profile™', 'Wedding Blueprint™', 'Venue walkthrough (if required)'] },
                { label: 'Wedding Day', items: ['Up to 8 hours of coverage', 'Vero as Lead Photographer', 'Nishank as Lead Cinematographer', 'Drone coverage (weather & venue permitting)', 'Professional audio recording', 'Multiple camera coverage'] },
                { label: 'After the Wedding', items: ['48-hour sneak peeks', 'Professionally edited online gallery', 'High-resolution downloads', '4–6 week delivery', '4–6 minute cinematic wedding film', 'Full ceremony film', 'Full speeches film'] },
              ].map(({ label, items }) => (
                <div key={label} className="mb-6">
                  <p className="label text-muted mb-3">{label}</p>
                  <ul className="space-y-2">
                    {items.map(item => (
                      <li key={item} className="flex items-start gap-2 text-sm text-ink-light">
                        <span className="text-muted mt-0.5 shrink-0">—</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
              <div className="mt-auto pt-6">
                <Link href="/contact?service=weddings&collection=signature" className="inline-flex w-full items-center justify-center border border-ink text-ink px-6 py-3 label hover:bg-ink hover:text-cream transition-colors">
                  Inquire
                </Link>
              </div>
            </div>

            {/* Collection II */}
            <div className="bg-ink text-cream p-8 flex flex-col">
              <p className="label text-cream/40 mb-1">Collection II · Most Popular ⭐</p>
              <h3 className="heading-serif text-2xl text-cream mb-1">The Grand Experience</h3>
              <p className="heading-display text-3xl text-cream mb-5">From $6,499</p>
              <p className="text-sm text-cream/70 leading-relaxed mb-8">Everything in Signature, plus more time, more planning, and a complete film premiere experience.</p>
              {[
                { label: 'Everything in Signature, plus:', items: ['Complimentary engagement session', 'Welcome gift', 'Vendor collaboration with your planner', 'Additional planning consultation'] },
                { label: 'Wedding Day', items: ['Up to 10 hours of coverage', 'Additional time for creative portraits', 'More comprehensive storytelling'] },
                { label: 'After the Wedding', items: ['Priority editing', '48-hour sneak peeks', 'Wedding Film Premiere™', 'Anniversary session at 50% off', 'Preferred client pricing on future sessions'] },
              ].map(({ label, items }) => (
                <div key={label} className="mb-6">
                  <p className="label text-cream/40 mb-3">{label}</p>
                  <ul className="space-y-2">
                    {items.map(item => (
                      <li key={item} className="flex items-start gap-2 text-sm text-cream/70">
                        <span className="text-cream/30 mt-0.5 shrink-0">—</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
              <div className="mt-auto pt-6">
                <Link href="/contact?service=weddings&collection=grand" className="inline-flex w-full items-center justify-center border border-cream text-cream px-6 py-3 label hover:bg-cream hover:text-ink transition-colors">
                  Inquire
                </Link>
              </div>
            </div>

            {/* Collection III */}
            <div className="bg-cream p-8 flex flex-col">
              <p className="label text-muted mb-1">Collection III</p>
              <h3 className="heading-serif text-2xl text-ink mb-1">The Legacy Experience</h3>
              <p className="heading-display text-3xl text-ink mb-5">From $8,999</p>
              <p className="text-sm text-ink-light leading-relaxed mb-8">The complete Fotogracia experience. Designed for couples who never want to wish they had added something later.</p>
              {[
                { label: 'Everything in Grand, plus:', items: ['VIP planning experience', 'Story Session™ (woven into your film)', 'Premium welcome gift'] },
                { label: 'Wedding Day', items: ['Second photographer', 'Second videographer', 'Behind-the-scenes moments', 'Optional same-day slideshow'] },
                { label: 'After the Wedding', items: ['24-hour sneak peeks', 'Luxury heirloom album', 'Three framed fine-art prints', 'Social media highlight reel', 'Private Film Premiere™', 'Legacy Box™ presentation', 'Anniversary portrait session included'] },
              ].map(({ label, items }) => (
                <div key={label} className="mb-6">
                  <p className="label text-muted mb-3">{label}</p>
                  <ul className="space-y-2">
                    {items.map(item => (
                      <li key={item} className="flex items-start gap-2 text-sm text-ink-light">
                        <span className="text-muted mt-0.5 shrink-0">—</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
              <div className="mt-auto pt-6">
                <Link href="/contact?service=weddings&collection=legacy" className="inline-flex w-full items-center justify-center border border-ink text-ink px-6 py-3 label hover:bg-ink hover:text-cream transition-colors">
                  Inquire
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── ADD-ONS ───────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-6 md:px-10 py-20 md:py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24 items-start">
          <div>
            <p className="label text-muted mb-6">Add-ons</p>
            <h2 className="heading-serif text-3xl md:text-4xl text-ink leading-snug">
              Tailor your collection with exactly what you need.
            </h2>
          </div>
          <div>
            {[
              { item: 'Additional hour', price: '$300' },
              { item: 'Luxury album', price: 'From $900' },
              { item: 'Parent album', price: '$500 each' },
              { item: 'Social media highlight reel', price: '$350' },
              { item: 'Engagement session', price: '$700' },
              { item: 'Anniversary session', price: '$450' },
              { item: 'Same-day slideshow', price: '$1,500' },
              { item: 'Additional photographer', price: '$800' },
              { item: 'Additional videographer', price: '$900' },
            ].map(({ item, price }, i) => (
              <div key={item} className={`flex items-center justify-between py-4 ${i > 0 ? 'border-t border-ink/10' : ''}`}>
                <span className="text-sm text-ink-light">{item}</span>
                <span className="label text-ink">{price}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHAT EVERY COUPLE RECEIVES ───────────────────── */}
      <section className="bg-cream-dark py-20 px-6 md:px-10">
        <div className="max-w-7xl mx-auto">
          <p className="label text-muted mb-10">What every Fotogracia couple receives</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-12 gap-y-3">
            {[
              'Vero as Lead Photographer',
              'Nishank as Lead Cinematographer',
              'Planning consultation',
              'Wedding Blueprint™',
              'Personality Profile™',
              'Drone coverage (where permitted)',
              'Professional audio recording',
              'Professionally edited photographs',
              'Cinematic wedding film',
              'High-resolution online gallery',
              'Print release',
              'Guidance throughout the day',
              'A calm, organised, and personalised experience',
            ].map(item => (
              <div key={item} className="flex items-start gap-3 py-2 border-b border-ink/10">
                <span className="text-muted shrink-0">—</span>
                <span className="text-sm text-ink-light">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── VENUE HUB ────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-6 md:px-10 py-20 md:py-24">
        <p className="label text-muted mb-10">Wedding venues</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {[
            {
              venue: 'Graydon Hall Manor',
              location: 'North York, Toronto',
              desc: 'A stately English manor house set against formal gardens and ravine greenspace — one of Toronto\'s most photographically rewarding wedding settings.',
              href: '/weddings/graydon-hall-manor',
              src: '/images/weddings/ryan-alyssa-27.jpg',
              alt: 'Graydon Hall Manor wedding photography — Fotogracia Toronto',
            },
            {
              venue: 'Catana Estate',
              location: 'Toronto & GTA',
              desc: 'An elegant estate setting that balances refined architecture with natural surroundings — beautifully suited to an editorial, unhurried approach.',
              href: '/weddings/catana-estate',
              src: '/images/weddings/doreen-david-24.jpg',
              alt: 'Catana Estate wedding photography — Fotogracia Toronto',
            },
          ].map(({ venue, location, desc, href, src, alt }) => (
            <Link key={venue} href={href} className="group block">
              <div className="overflow-hidden mb-5">
                <Image
                  src={src}
                  alt={alt}
                  width={0}
                  height={0}
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="w-full h-auto group-hover:opacity-90 transition-opacity"
                />
              </div>
              <p className="label text-muted mb-1">{location}</p>
              <h3 className="heading-serif text-2xl text-ink mb-2 group-hover:opacity-60 transition-opacity">{venue}</h3>
              <p className="text-sm text-ink-light leading-relaxed mb-3">{desc}</p>
              <span className="label text-ink link-underline text-sm">View venue photography →</span>
            </Link>
          ))}
        </div>
        <div className="border-t border-ink/10 pt-8">
          <p className="label text-muted mb-3">Also available for</p>
          <p className="text-sm text-ink-light leading-relaxed max-w-2xl">
            Fotogracia is available for weddings across Toronto and the GTA — including the Ritz-Carlton Toronto, Four Seasons Hotel Toronto, Casa Loma, the Aga Khan Museum, The Carlu, Arcadian Court, and destination weddings upon request.
          </p>
        </div>
      </section>

      {/* ── GALLERY ──────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-6 md:px-10 pb-24 md:pb-32">
        <p className="label text-muted mb-10">Selected weddings</p>
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 md:gap-6">
          {weddingImages.map(({ src, alt }) => (
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
        <p className="label text-muted mb-6">Limited availability each season</p>
        <h2 className="heading-display text-5xl md:text-6xl lg:text-7xl text-ink leading-none mb-10">
          Let&apos;s talk about<br />your wedding.
        </h2>
        <p className="text-sm text-muted max-w-sm mx-auto mb-10 leading-relaxed">
          Reach out with your date, venue, and a little about your celebration. All enquiries receive a personal response within 48 hours.
        </p>
        <Link
          href="/contact?service=weddings"
          className="inline-flex items-center justify-center border border-ink text-ink px-10 py-4 label hover:bg-ink hover:text-cream transition-colors"
        >
          Begin the Conversation
        </Link>
      </section>
    </div>
  );
}
