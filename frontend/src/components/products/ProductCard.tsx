import Link from 'next/link';
import Image from 'next/image';
import { Product, StrapiItem } from '@/types';

interface ProductCardProps {
  product: StrapiItem<Product>;
}

export default function ProductCard({ product: p }: ProductCardProps) {
  const imageUrl =
    p.image?.url || 'https://via.placeholder.com/300x200?text=No+Image';

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow h-full flex flex-col">
      {/* Image */}
      <div className="relative h-48 bg-gray-100 overflow-hidden">
        <Image
          src={imageUrl}
          alt={p.name}
          fill
          className="object-cover"
        />
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1">
        <h3 className="font-serif text-lg font-bold text-gray-900 mb-2">
          {p.name}
        </h3>

        {p.description && (
          <p className="text-sm text-gray-600 mb-4 line-clamp-2 flex-1">
            {p.description}
          </p>
        )}

        <div className="flex items-center justify-between mt-4">
          {p.price && (
            <span className="text-lg font-bold text-brand-600">
              {p.currency} {p.price}
            </span>
          )}

          <Link
            href={`/api/affiliate/${p.id}`}
            className="px-4 py-2 bg-brand-500 text-white font-semibold rounded text-sm hover:bg-brand-600 transition-colors"
          >
            Shop Now →
          </Link>
        </div>
      </div>
    </div>
  );
}
