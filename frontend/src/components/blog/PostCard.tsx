import Link from 'next/link';
import Image from 'next/image';
import { Post, StrapiItem } from '@/types';
import CategoryBadge from '@/components/ui/CategoryBadge';
import { IMAGE_SIZES, getSizeRecommendation } from '@/lib/image-sizes';

interface PostCardProps {
  post: StrapiItem<Post>;
}

export default function PostCard({ post: p }: PostCardProps) {
  if (!p) return null;

  const imageUrl =
    p.coverImage?.url ||
    'https://via.placeholder.com/400x300?text=No+Image';
  const imageAlt = p.coverImage?.alternativeText || p.title;
  const recommendedSize = getSizeRecommendation('COVER_IMAGE');

  const publishDate = p.publishedAt ? new Date(p.publishedAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }) : '';

  const category = p.category;

  return (
    <article className="flex flex-col h-full bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <div
        className="relative h-48 w-full overflow-hidden bg-gray-100"
        title={`Recommended cover image size: ${recommendedSize}`}
      >
        <Image
          src={imageUrl}
          alt={imageAlt}
          fill
          className="object-cover hover:scale-105 transition-transform duration-300"
        />
      </div>

      <div className="flex-1 flex flex-col p-5">
        <div className="mb-3">
          {category && (
            <CategoryBadge name={category.name} slug={category.slug} />
          )}
        </div>

        <h3 className="font-serif text-lg font-bold text-gray-900 mb-2 line-clamp-2">
          <Link href={`/blog/${p.slug}`} className="hover:text-brand-600">
            {p.title}
          </Link>
        </h3>

        <p className="text-sm text-gray-600 mb-4 line-clamp-2 flex-1">
          {p.excerpt}
        </p>

        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <time className="text-xs text-gray-500">{publishDate}</time>
          <Link
            href={`/blog/${p.slug}`}
            className="text-xs font-semibold text-brand-600 hover:text-brand-700"
          >
            Read More →
          </Link>
        </div>
      </div>
    </article>
  );
}
