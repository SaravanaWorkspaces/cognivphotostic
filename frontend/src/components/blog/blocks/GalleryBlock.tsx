import Image from 'next/image';
import { GalleryBlock as GalleryBlockType } from '@/types';

interface GalleryBlockProps {
  block: GalleryBlockType;
}

export default function GalleryBlock({ block }: GalleryBlockProps) {
  const images = block.images?.filter((img) => img);
  if (!images || images.length === 0) return null;

  const colsClass = {
    1: 'grid-cols-1',
    2: 'grid-cols-2',
    3: 'grid-cols-3',
    4: 'grid-cols-4',
  }[Math.min(images.length, 4)] || 'grid-cols-3';

  return (
    <div className={`grid ${colsClass} gap-4 my-8`}>
      {images.map((img, idx) => {
        if (!img) return null;

        return (
          <div
            key={idx}
            className="relative w-full h-64 bg-gray-100 rounded-lg overflow-hidden"
          >
            <Image
              src={img.url}
              alt={img.alternativeText || `Gallery image ${idx + 1}`}
              fill
              className="object-cover hover:scale-105 transition-transform"
            />
          </div>
        );
      })}
    </div>
  );
}
