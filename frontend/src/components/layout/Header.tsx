import Link from 'next/link';
import { getCategories } from '@/lib/api';
import { StrapiItem } from '@/types';
import { Category } from '@/types';

export default async function Header() {
  let categories: StrapiItem<Category>[] = [];
  try {
    const res = await getCategories();
    categories = res.data || [];
  } catch (err) {
    // Silently fail on header load — not critical
  }

  return (
    <header className="border-b border-brand-100 sticky top-0 z-40 bg-white">
      <nav className="container-wide flex items-center justify-between py-4">
        <Link href="/" className="flex items-center gap-2">
          <span className="font-serif text-2xl font-bold text-brand-500">
            CognivPhotostic
          </span>
        </Link>

        <div className="flex items-center gap-6">
          <Link href="/blog" className="text-sm font-medium hover:text-brand-600">
            Blog
          </Link>

          <Link href="/products" className="text-sm font-medium hover:text-brand-600">
            Shop
          </Link>

          {categories.length > 0 && (
            <div className="hidden md:flex items-center gap-4">
              {categories.filter((cat) => cat.slug).slice(0, 4).map((cat) => (
                <Link
                  key={cat.id}
                  href={`/category/${cat.slug}`}
                  className="text-sm text-gray-600 hover:text-brand-600"
                >
                  {cat.name}
                </Link>
              ))}
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}
