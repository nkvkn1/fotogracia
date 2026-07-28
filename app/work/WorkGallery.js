'use client';

import { useState, useRef, useEffect, Suspense } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

const categories = ['All', 'Portraits', 'Weddings', 'Content'];

const weddingPhotos = [
  'ryan-alyssa-27','ryan-alyssa-6','ryan-alyssa-12','ryan-alyssa-37',
  'ryan-alyssa-45','ryan-alyssa-51','ryan-alyssa-60','ryan-alyssa-9',
  'ryan-alyssa-13','ryan-alyssa-19','ryan-alyssa-24','ryan-alyssa-41',
  'ryan-alyssa-46','ryan-alyssa-61','ryan-alyssa-65','ryan-alyssa-68',
  'doreen-david-6','doreen-david-10','doreen-david-13','doreen-david-14',
  'doreen-david-24','doreen-david-30','doreen-david-33','doreen-david-37',
  'doreen-david-40','doreen-david-43','doreen-david-47','doreen-david-49',
  'doreen-david-50','doreen-david-60','doreen-david-74','doreen-david-75',
  'doreen-david-79','doreen-david-83','doreen-david-88','doreen-david-97',
  'doreen-david-98','doreen-david-101','doreen-david-102','doreen-david-108',
  'doreen-david-109','doreen-david-115','doreen-david-116',
];

const portraitPhotos = [
  'p-01','p-02','p-03','p-04','p-05','p-06','p-07',
  'p-08','p-09','p-10','p-11','p-12','p-13','p-14',
];

let id = 1;
const items = [
  ...weddingPhotos.map((file, i) => ({
    id: id++,
    category: 'Weddings',
    src: `/images/weddings/${file}.jpg`,
    alt: `Wedding photo ${i + 1}`,
    type: 'image',
  })),
  ...portraitPhotos.map((file, i) => ({
    id: id++,
    category: 'Portraits',
    src: `/images/portraits/${file}.jpg`,
    alt: `Portrait ${i + 1}`,
    type: 'image',
  })),
  {
    id: id++,
    category: 'Content',
    src: '/images/content/reel-1.mp4',
    alt: 'Content reel',
    type: 'video',
  },
];

function VideoItem({ item }) {
  const [muted, setMuted] = useState(true);
  const videoRef = useRef(null);

  const toggleMute = () => {
    setMuted((prev) => {
      if (videoRef.current) videoRef.current.muted = !prev;
      return !prev;
    });
  };

  return (
    <div className="break-inside-avoid group mb-4 md:mb-6">
      <div className="relative w-full overflow-hidden bg-ink" style={{ aspectRatio: '9/16' }}>
        <video
          ref={videoRef}
          src={item.src}
          className="absolute inset-0 w-full h-full object-cover"
          autoPlay
          muted
          loop
          playsInline
        />
        <button
          onClick={toggleMute}
          className="absolute bottom-4 right-4 z-10 flex items-center gap-1.5 bg-black/50 hover:bg-black/70 text-cream/90 px-3 py-1.5 transition-colors"
          aria-label={muted ? 'Unmute' : 'Mute'}
        >
          {muted ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
              <line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/>
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
              <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/>
            </svg>
          )}
          <span className="label text-[10px]">{muted ? 'Unmute' : 'Mute'}</span>
        </button>
      </div>
      <p className="label text-muted mt-2">Content</p>
    </div>
  );
}

function GalleryItem({ item }) {
  if (item.type === 'video') return <VideoItem item={item} />;

  return (
    <div className="break-inside-avoid group mb-4 md:mb-6">
      <Image
        src={item.src}
        alt={item.alt}
        width={0}
        height={0}
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        className="w-full h-auto transition-opacity group-hover:opacity-90"
      />
      <p className="label text-muted mt-2">{item.category}</p>
    </div>
  );
}

function WorkContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('category');
  const validInitial = categories.includes(initialCategory) ? initialCategory : 'All';
  const [active, setActive] = useState(validInitial);

  // If URL param changes (e.g. browser back/forward), update filter
  useEffect(() => {
    const cat = searchParams.get('category');
    if (categories.includes(cat)) setActive(cat);
  }, [searchParams]);

  const filtered = active === 'All' ? items : items.filter((i) => i.category === active);

  const counts = {
    All: items.length,
    Weddings: items.filter(i => i.category === 'Weddings').length,
    Portraits: items.filter(i => i.category === 'Portraits').length,
    Content: items.filter(i => i.category === 'Content').length,
  };

  return (
    <>
      {/* Filter tabs */}
      <div className="max-w-7xl mx-auto px-6 md:px-10 mb-10">
        <div className="flex gap-6 border-b border-ink/10 pb-4">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActive(cat)}
              className={`label transition-all flex items-center gap-2 ${
                active === cat ? 'text-ink' : 'text-muted hover:text-ink'
              }`}
            >
              {cat}
              <span className={`text-[9px] ${active === cat ? 'opacity-40' : 'opacity-30'}`}>
                {counts[cat]}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Masonry grid */}
      <div className="max-w-7xl mx-auto px-6 md:px-10 pb-24">
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 md:gap-6">
          {filtered.map((item) => (
            <GalleryItem key={item.id} item={item} />
          ))}
        </div>
        {filtered.length === 0 && (
          <p className="label text-muted text-center py-24">Nothing here yet.</p>
        )}
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-10 pb-24 text-center">
        <p className="heading-serif text-2xl md:text-3xl text-ink mb-6">
          Like what you see? Let's talk.
        </p>
        <Link
          href="/contact"
          className="inline-flex items-center justify-center border border-ink text-ink px-10 py-4 label hover:bg-ink hover:text-cream transition-colors"
        >
          Book a session
        </Link>
      </div>
    </>
  );
}
export default function WorkGallery() {
  return (
    <>
      <WorkContent />
    </>
  );
}
