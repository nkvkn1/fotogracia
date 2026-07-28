'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const links = [
  { href: '/weddings', label: 'Weddings' },
  { href: '/work', label: 'Portfolio' },
  { href: '/services', label: 'Services' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Enquire' },
];

export default function Nav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Home page only: cream/white text when unscrolled (readable over dark hero)
  // All other pages: always ink text
  const isHome = pathname === '/';
  const textColor = (isHome && !scrolled) ? 'text-cream' : 'text-ink';
  const barColor  = (isHome && !scrolled) ? 'bg-cream'   : 'bg-ink';

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? 'bg-cream/95 backdrop-blur-sm border-b border-ink/5' : 'bg-transparent'
        }`}
      >
        <nav className="max-w-7xl mx-auto px-6 md:px-10 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className={`label tracking-widest hover:opacity-70 transition-opacity ${textColor}`}
          >
            Fotogracia
          </Link>

          {/* Desktop links */}
          <ul className="hidden md:flex items-center gap-10">
            {links.map(({ href, label }) => (
              <li key={href}>
                <Link
                  href={href}
                  className={`label transition-opacity ${textColor} ${
                    pathname === href ? 'opacity-100' : 'opacity-60 hover:opacity-100'
                  }`}
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Mobile hamburger */}
          <button
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
            className="md:hidden flex flex-col justify-center items-end gap-[5px] w-8 h-8"
          >
            <span className={`block h-px ${barColor} transition-all duration-300 origin-right ${open ? 'w-6 rotate-[-45deg] translate-y-[3px]' : 'w-6'}`} />
            <span className={`block h-px ${barColor} transition-all duration-300 ${open ? 'w-0 opacity-0' : 'w-4'}`} />
            <span className={`block h-px ${barColor} transition-all duration-300 origin-right ${open ? 'w-6 rotate-[45deg] -translate-y-[3px]' : 'w-5'}`} />
          </button>
        </nav>
      </header>

      {/* Mobile menu overlay */}
      <div
        className={`fixed inset-0 z-40 bg-cream flex flex-col justify-center items-center transition-all duration-500 md:hidden ${
          open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        <ul className="flex flex-col items-center gap-8">
          {links.map(({ href, label }) => (
            <li key={href}>
              <Link
                href={href}
                className="heading-serif text-4xl text-ink hover:opacity-50 transition-opacity"
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>
        <p className="label text-muted mt-16 tracking-widest">fotogracia.com</p>
      </div>
    </>
  );
}
