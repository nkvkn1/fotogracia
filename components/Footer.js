import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="border-t border-ink/10 mt-24">
      <div className="max-w-7xl mx-auto px-6 md:px-10 py-12 grid grid-cols-1 md:grid-cols-4 gap-10">
        {/* Brand */}
        <div className="md:col-span-1">
          <p className="label tracking-widest text-ink">Fotogracia</p>
          <p className="label text-muted mt-1">Editorial Wedding Photography · Toronto & GTA</p>
          <a
            href="https://instagram.com/_fotogracia_"
            target="_blank"
            rel="noopener noreferrer"
            className="label text-muted hover:text-ink transition-colors mt-4 inline-block"
          >
            Instagram
          </a>
        </div>

        {/* Pages */}
        <div>
          <p className="label text-ink mb-4">Pages</p>
          <nav className="flex flex-col gap-3">
            {[
              { href: '/weddings', label: 'Weddings' },
              { href: '/mens-portrait', label: 'Portraits' },
              { href: '/work', label: 'Portfolio' },
              { href: '/services', label: 'Services' },
              { href: '/about', label: 'About' },
              { href: '/contact', label: 'Enquire' },
            ].map(({ href, label }) => (
              <Link key={href} href={href} className="label text-muted hover:text-ink transition-colors">
                {label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Venues */}
        <div>
          <p className="label text-ink mb-4">Venues</p>
          <nav className="flex flex-col gap-3">
            {[
              { href: '/weddings/graydon-hall-manor', label: 'Graydon Hall Manor' },
              { href: '/weddings/catana-estate', label: 'Catana Estate' },
              { href: '/weddings', label: 'All Venues →' },
            ].map(({ href, label }) => (
              <Link key={href} href={href} className="label text-muted hover:text-ink transition-colors">
                {label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Services */}
        <div>
          <p className="label text-ink mb-4">Services</p>
          <nav className="flex flex-col gap-3">
            {[
              { href: '/weddings', label: 'Wedding Photography' },
              { href: '/mens-portrait', label: 'Portrait Sessions' },
              { href: '/services#content', label: 'Content Creation' },
              { href: '/contact', label: 'Get in Touch' },
            ].map(({ href, label }) => (
              <Link key={href} href={href} className="label text-muted hover:text-ink transition-colors">
                {label}
              </Link>
            ))}
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-10 pb-8 border-t border-ink/10 pt-6">
        <p className="label text-muted">
          © {new Date().getFullYear()} Fotogracia — Editorial Wedding Photography, Toronto
        </p>
      </div>
    </footer>
  );
}
