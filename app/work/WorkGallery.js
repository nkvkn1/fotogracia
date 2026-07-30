'use client';

import { useState, useRef, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

import ProcessedImage from '@/components/ProcessedImage';
import { getAsset, getCategory } from '@/lib/images';

const categories = ['All', 'Portraits', 'Weddings', 'Content'];

/**
 * The gallery is built from the compiled manifest, not a hand-maintained list
 * of filenames. Dropping a photograph into assets/originals/weddings/ and
 * running `npm run publish-images` is all it takes to have it appear here.
 *
 * Which category a photograph belongs to is decided by the folder it sits in,
 * so there is nothing to keep in sync.
 */
const fromCategory = (folder, label, altFor) =>
  getCategory(folder, { type: 'image' }).map((record, i) => ({
    key: record.id,
    imageId: record.id,
    category: label,
    alt: altFor(record, i),
    type: 'image',
  }));

const items = [
  ...fromCategory('weddings', 'Weddings', (_r, i) => `Wedding photo ${i + 1}`),
  ...fromCategory('portraits', 'Portraits', (_r, i) => `Portrait ${i + 1}`),
  ...getCategory('content', { type: 'video' }).map((record) => {
    const asset = getAsset(record.id);
    return {
      key: record.id,
      category: 'Content',
      alt: 'Content reel',
      type: 'video',
      sources: asset.sources,
      poster: asset.posterUrl,
    };
  }),
];

/** Speaker glyph that reflects how loud the video actually is. */
function VolumeIcon({ level }) {
  const common = {
    xmlns: 'http://www.w3.org/2000/svg',
    width: 16,
    height: 16,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.5,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
  };
  const speaker = <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />;

  if (level === 'muted') {
    return (
      <svg {...common} aria-hidden="true">
        {speaker}
        <line x1="23" y1="9" x2="17" y2="15" />
        <line x1="17" y1="9" x2="23" y2="15" />
      </svg>
    );
  }
  return (
    <svg {...common} aria-hidden="true">
      {speaker}
      {level === 'low' ? (
        <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
      ) : (
        <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
      )}
    </svg>
  );
}

function VideoItem({ item }) {
  // Autoplay is only permitted while muted, so that is where we start.
  const [muted, setMuted] = useState(true);
  const [volume, setVolume] = useState(0.8);
  const videoRef = useRef(null);

  // Drive the element from state rather than poking it in each handler, so the
  // two controls can never disagree about what the video is doing.
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = muted;
    video.volume = volume;
  }, [muted, volume]);

  const toggleMute = () => {
    // Unmuting at zero would look broken — give it something audible back.
    if (muted && volume === 0) setVolume(0.8);
    setMuted((prev) => !prev);
  };

  const onVolumeChange = (event) => {
    const next = Number(event.target.value);
    setVolume(next);
    // Dragging the slider is an intent to hear it (or not) — follow that
    // rather than making the user also press unmute.
    setMuted(next === 0);
  };

  const audible = !muted && volume > 0;
  const level = !audible ? 'muted' : volume < 0.5 ? 'low' : 'high';
  const percent = Math.round(volume * 100);

  return (
    <div className="break-inside-avoid group mb-4 md:mb-6">
      <div className="relative w-full overflow-hidden bg-ink" style={{ aspectRatio: '9/16' }}>
        {/* Sources are ordered best-first and each declares its codec, so a
            browser skips anything it cannot decode rather than picking a file
            that would play audio over a frozen poster. */}
        <video
          ref={videoRef}
          poster={item.poster ?? undefined}
          className="absolute inset-0 w-full h-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
        >
          {item.sources.map((s) => (
            <source key={s.src} src={s.src} type={s.type} />
          ))}
        </video>

        {/* The slider stays collapsed until the tile is hovered or something
            inside it takes focus, so the artwork is not competing with chrome. */}
        <div className="absolute bottom-4 right-4 z-10 flex items-center bg-black/50 hover:bg-black/70 focus-within:bg-black/70 transition-colors">
          <button
            onClick={toggleMute}
            className="flex items-center gap-1.5 text-cream/90 px-3 py-1.5"
            aria-label={audible ? 'Mute' : 'Unmute'}
          >
            <VolumeIcon level={level} />
            <span className="label text-[10px]">{audible ? 'Mute' : 'Unmute'}</span>
          </button>

          {/* Collapsed until hovered or focused on pointer devices; always open
              where there is no hover to reveal it (touch), so the control is
              never unreachable. */}
          <label className="flex items-center overflow-hidden max-w-0 opacity-0 group-hover:max-w-[6rem] group-hover:opacity-100 focus-within:max-w-[6rem] focus-within:opacity-100 [@media(hover:none)]:max-w-[6rem] [@media(hover:none)]:opacity-100 transition-all duration-300">
            <span className="sr-only">Volume</span>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={muted ? 0 : volume}
              onChange={onVolumeChange}
              aria-label="Volume"
              aria-valuetext={`${muted ? 0 : percent}%`}
              className="w-20 mr-3 h-1 cursor-pointer accent-cream bg-cream/30 appearance-none rounded-full [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-cream [&::-moz-range-thumb]:h-3 [&::-moz-range-thumb]:w-3 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-cream [&::-moz-range-thumb]:border-0"
            />
          </label>
        </div>
      </div>
      <p className="label text-muted mt-2">Content</p>
    </div>
  );
}

function GalleryItem({ item }) {
  if (item.type === 'video') return <VideoItem item={item} />;

  return (
    <div className="break-inside-avoid group mb-4 md:mb-6">
      <ProcessedImage
        id={item.imageId}
        size="small"
        alt={item.alt}
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
            <GalleryItem key={item.key} item={item} />
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
