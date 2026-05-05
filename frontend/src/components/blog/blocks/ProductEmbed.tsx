import Link from 'next/link';
import Image from 'next/image';
import { ProductEmbedBlock } from '@/types';

interface ProductEmbedProps {
  block: ProductEmbedBlock;
  postId?: number;
}

export default function ProductEmbed({ block, postId }: ProductEmbedProps) {
  const product = block.product;
  if (!product) return null;

  const imageUrl =
    product.image?.url || 'https://via.placeholder.com/300x200?text=No+Image';

  return (
    <div className="my-8 bg-brand-50 rounded-lg p-6 border border-brand-100">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
        {imageUrl && (
          <div className="relative h-48 md:h-auto rounded-lg overflow-hidden bg-gray-100">
            <Image
              src={imageUrl}
              alt={product.image?.alternativeText || product.name}
              fill
              className="object-cover"
            />
          </div>
        )}

        <div className="md:col-span-2 flex flex-col">
          <h3 className="font-serif text-lg font-bold text-gray-900 mb-2">
            {product.name}
          </h3>

          {product.description && (
            <p className="text-sm text-gray-700 mb-4 flex-1">
              {product.description}
            </p>
          )}

          <div className="flex items-center justify-between">
            {product.price && (
              <span className="text-lg font-bold text-brand-600">
                {product.currency} {product.price}
              </span>
            )}

            <Link
              href={`/api/affiliate/${product.id}${postId ? `?postId=${postId}` : ''}`}
              className="px-4 py-2 bg-brand-500 text-white font-semibold rounded hover:bg-brand-600 transition-colors"
            >
              View Product →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
