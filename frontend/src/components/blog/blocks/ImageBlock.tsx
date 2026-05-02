import Image from 'next/image';
import { ImageBlock as ImageBlockType } from '@/types';

interface ImageBlockProps {
  block: ImageBlockType;
}

export default function ImageBlock({ block }: ImageBlockProps) {
  const imageData = block.image?.data?.attributes;
  if (!imageData) return null;

  return (
    <figure className="my-8">
      <div className="relative w-full h-96 bg-gray-100 rounded-lg overflow-hidden">
        <Image
          src={imageData.url}
          alt={block.image?.data?.attributes?.alternativeText || 'Image'}
          fill
          className="object-cover"
        />
      </div>
      {block.caption && (
        <figcaption className="text-center text-sm text-gray-600 mt-3 italic">
          {block.caption}
        </figcaption>
      )}
    </figure>
  );
}
