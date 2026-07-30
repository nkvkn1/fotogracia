import './globals.css';
import { Cormorant_Garamond, Inter } from 'next/font/google';
import Nav from '../components/Nav';
import Footer from '../components/Footer';
import { getImageSource } from '@/lib/images';

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  style: ['normal', 'italic'],
  variable: '--font-cormorant',
  display: 'swap',
  fallback: ['Georgia', 'serif'],
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
  fallback: ['system-ui', 'sans-serif'],
});

export const metadata = {
  title: {
    default: 'Editorial Wedding Photographer Toronto | Fotogracia',
    template: '%s | Fotogracia',
  },
  description:
    'Fotogracia is a Toronto-based editorial wedding photographer documenting elegant celebrations across the GTA. Refined imagery for couples who value thoughtful, timeless photography.',
  metadataBase: new URL('https://fotogracia.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Editorial Wedding Photographer Toronto | Fotogracia',
    description:
      'Refined, editorial wedding photography for elegant celebrations across Toronto and the GTA. Recent work at Graydon Hall Manor and Catana Estate.',
    url: 'https://fotogracia.com',
    siteName: 'Fotogracia',
    locale: 'en_CA',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Editorial Wedding Photographer Toronto | Fotogracia',
    description:
      'Refined, editorial wedding photography for elegant celebrations across Toronto and the GTA.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  keywords: [
    'editorial wedding photographer Toronto',
    'Toronto wedding photographer',
    'GTA wedding photographer',
    'refined wedding photography Toronto',
    'elegant wedding photography Toronto',
    'Graydon Hall Manor wedding photographer',
    'Graydon Hall Manor wedding photography',
    'Catana Estate wedding photographer',
    'Catana Estate wedding photography',
    'Ritz-Carlton Toronto wedding photographer',
    'Four Seasons Toronto wedding photographer',
    'Casa Loma wedding photographer',
    "men's portrait photographer Toronto",
    'personal branding photographer Toronto',
  ],
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': ['LocalBusiness', 'Photographer'],
      '@id': 'https://fotogracia.com/#business',
      name: 'Fotogracia',
      description:
        'Toronto-based editorial wedding photographer documenting elegant celebrations across the GTA. Refined, intentional imagery for couples and professionals.',
      url: 'https://fotogracia.com',
      email: 'info@fotogracia.com',
      image: `https://fotogracia.com${getImageSource('misc/hero', 'large').src}`,
      priceRange: '$$$',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Toronto',
        addressRegion: 'ON',
        addressCountry: 'CA',
      },
      areaServed: [
        'Toronto',
        'North York',
        'Etobicoke',
        'Mississauga',
        'Oakville',
        'Vaughan',
        'Richmond Hill',
        'GTA',
      ],
      sameAs: ['https://instagram.com/_fotogracia_'],
    },
  ],
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${cormorant.variable} ${inter.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="bg-cream text-ink min-h-screen flex flex-col">
        <Nav />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
