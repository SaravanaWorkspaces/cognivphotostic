'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

interface Props {
  src: string;
  alt: string;
  /** Height of the hero placement; defaults to h-96 to match the existing layout. */
  heightClass?: string;
}

export default function ZoomableHero({ src, alt, heightClass = 'h-96' }: Props) {
  const [open, setOpen] = useState(false);

  // Close on Escape; lock body scroll while open.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Open image fullscreen"
        className={`relative w-full ${heightClass} bg-gray-100 cursor-zoom-in group overflow-hidden`}
      >
        <Image
          src={src}
          alt={alt}
          fill
          priority
          sizes="100vw"
          className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
        />
      </button>

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Image preview"
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 sm:p-8 cursor-zoom-out"
        >
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); setOpen(false); }}
            aria-label="Close"
            className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full h-full max-w-[95vw] max-h-[95vh] cursor-default"
          >
            <Image
              src={src}
              alt={alt}
              fill
              sizes="95vw"
              className="object-contain"
              priority
            />
          </div>
        </div>
      )}
    </>
  );
}
