// This file provides metadata for the /work route.
// The actual interactive gallery is in WorkGallery.js (client component).
import { Suspense } from 'react';
import WorkGallery from './WorkGallery';

export const metadata = {
  title: 'Wedding & Portrait Portfolio — Toronto | Fotogracia',
  description:
    'Browse the Fotogracia portfolio — editorial wedding photography and portrait sessions across Toronto and the GTA. Recent work at Graydon Hall Manor and Catana Estate.',
  alternates: {
    canonical: 'https://fotogracia.com/work',
  },
};

export default function WorkPage() {
  return (
    <div className="pt-24">
      <div className="max-w-7xl mx-auto px-6 md:px-10 py-12 md:py-16">
        <p className="label text-muted mb-3">Portfolio</p>
        <h1 className="heading-display text-5xl md:text-6xl text-ink">The work.</h1>
      </div>
      <Suspense fallback={<div className="max-w-7xl mx-auto px-6 md:px-10 mb-10 h-12" />}>
        <WorkGallery />
      </Suspense>
    </div>
  );
}
