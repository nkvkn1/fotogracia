import ProcessedImage from '@/components/ProcessedImage';
import Link from 'next/link';

export const metadata = {
  title: 'About — Fotogracia, Editorial Wedding Photographer Toronto',
  description:
    'Fotogracia is a Toronto-based editorial wedding photographer documenting elegant celebrations across the GTA. Refined, intentional imagery for couples and professionals.',
  alternates: {
    canonical: 'https://fotogracia.com/about',
  },
};

export default function AboutPage() {
  return (
    <div className="pt-24">
      <div className="max-w-7xl mx-auto px-6 md:px-10 py-12 md:py-16">
        <p className="label text-muted mb-3">The photographer</p>
        <h1 className="heading-display text-5xl md:text-6xl text-ink">About.</h1>
      </div>

      {/* Bio section */}
      <section className="max-w-7xl mx-auto px-6 md:px-10 pb-24 md:pb-32">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-start">
          {/* Photographer portrait */}
          <ProcessedImage
            id="nishank/nk-01"
            size="medium"
            alt="Nishank Kumar — photographer"
            sizes="(max-width: 768px) 100vw, 50vw"
            className="w-full h-auto"
          />

          {/* Bio text */}
          <div className="md:pt-8">
            <h2 className="heading-serif text-3xl md:text-4xl text-ink mb-6 leading-snug">
              Fotogracia is a Toronto-based photography practice focused on editorial wedding and portrait photography — built on the belief that great imagery is a result of genuine attention, not just technical skill.
            </h2>
            <div className="space-y-4 text-ink-light text-sm leading-relaxed">
              <p>
                The work started the way most photography does — with an instinct to pay attention to things others walk past. Over time, that developed into a consistent approach: slow down, observe carefully, and trust the moment rather than forcing it.
              </p>
              <p>
                With eight years of experience across weddings, portraits, and editorial work, that same approach shapes every Fotogracia engagement. Recent wedding celebrations have been documented at Graydon Hall Manor and Catana Estate — refined venues that reflect the kind of considered, meaningful work this practice is built around.
              </p>
              <p>
                Today, Fotogracia works with couples and professionals across Toronto and the GTA who value imagery that is thoughtful, editorial, and genuinely representative of who they are and what they are celebrating.
              </p>
              <p>
                Based in Toronto. Available for destination engagements worldwide.
              </p>
            </div>

            <div className="mt-10 grid grid-cols-2 gap-6 border-t border-ink/10 pt-8">
              {[
                { label: 'Based in', value: 'Toronto, ON' },
                { label: 'Available for', value: 'Travel & Destination' },
                { label: 'Specialties', value: 'Luxury Weddings, Executive Portraits' },
                { label: 'Gallery delivery', value: 'Preview within 48 hrs · full gallery within 4–6 weeks' },
              ].map(({ label, value }) => (
                <div key={label}>
                  <p className="label text-muted mb-1">{label}</p>
                  <p className="text-sm text-ink">{value}</p>
                </div>
              ))}
            </div>

            <Link
              href="/contact"
              className="inline-flex items-center justify-center border border-ink text-ink px-8 py-3 label hover:bg-ink hover:text-cream transition-colors mt-10"
            >
              Begin the Conversation
            </Link>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-cream-dark py-20 px-6 md:px-10">
        <div className="max-w-7xl mx-auto">
          <p className="label text-muted mb-10">The philosophy</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              {
                num: '01',
                title: 'Observation over direction',
                body: 'The most enduring images tend to be the ones you didn\'t realise were happening. Being present, unhurried, and genuinely observant is what makes them possible.',
              },
              {
                num: '02',
                title: 'Light as the medium',
                body: 'Understanding light — how it falls, shifts, and transforms a space — is at the core of every image. Finding it, or working with what is there, shapes everything.',
              },
              {
                num: '03',
                title: 'A seamless client experience',
                body: 'From the first message to the final gallery delivery, the experience should feel easy, clear, and well-organised. Good communication is part of the job.',
              },
            ].map(({ num, title, body }) => (
              <div key={num}>
                <p className="label text-muted mb-3">{num}</p>
                <h3 className="heading-serif text-xl text-ink mb-3">{title}</h3>
                <p className="text-sm text-ink-light leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
