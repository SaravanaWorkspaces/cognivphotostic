import Link from 'next/link';

interface CategoryBadgeProps {
  name: string;
  slug: string;
}

export default function CategoryBadge({ name, slug }: CategoryBadgeProps) {
  return (
    <Link
      href={`/category/${slug}`}
      className="inline-block px-3 py-1 bg-brand-100 text-brand-700 text-xs font-semibold rounded-full hover:bg-brand-200 transition-colors"
    >
      {name}
    </Link>
  );
}
