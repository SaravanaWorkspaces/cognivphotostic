import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getCategoryBySlug, getPosts, getCategories } from '@/lib/api';
import { config } from '@/lib/config';
import { Category } from '@/types';
import PostGrid from '@/components/blog/PostGrid';
import Pagination from '@/components/blog/Pagination';

export const revalidate = 86400;

export async function generateStaticParams() {
  try {
    const response = await getCategories();
    return (response.data || [])
      .filter((cat) => cat.slug)
      .map((cat) => ({
        slug: cat.slug,
      }));
  } catch (err) {
    console.error('Failed to generate category static params:', err);
    return [];
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;

  try {
    const response = await getCategoryBySlug(slug);
    if (!response?.data) {
      return { title: 'Category not found' };
    }
    const category = response.data as Category;

    return {
      title: `${category.name} — ${config.site.name}`,
      description:
        category.description || `Explore articles in the ${category.name} category.`,
    };
  } catch (err) {
    console.error('Failed to generate category metadata:', err);
    return { title: 'Category' };
  }
}

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
}) {
  const { slug } = await params;
  const resolvedParams = await searchParams;
  const page = parseInt(resolvedParams.page || '1', 10);

  try {
    const categoryResponse = await getCategoryBySlug(slug);
    if (!categoryResponse?.data) {
      notFound();
    }
    const category = categoryResponse.data as Category;

    const postsResponse = await getPosts({
      category: slug,
      page,
      pageSize: config.pagination.pageSize,
    });

    const posts = postsResponse.data || [];
    const pagination = postsResponse.meta.pagination;

    return (
      <div className="container-wide py-12">
        <div className="mb-8">
          {category.parent && (
            <Link
              href={`/category/${category.parent.slug}`}
              className="text-sm text-gray-500 hover:text-brand-600"
            >
              ← {category.parent.name}
            </Link>
          )}
          <h1 className="font-serif text-4xl font-bold text-gray-900 mb-2 mt-1">
            {category.name}
          </h1>
          {category.description && (
            <p className="text-lg text-gray-600">{category.description}</p>
          )}

          {category.children && category.children.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-6">
              {category.children.map((child) => (
                <Link
                  key={child.id}
                  href={`/category/${child.slug}`}
                  className="px-3 py-1 text-sm rounded-full bg-brand-50 text-brand-700 hover:bg-brand-100"
                >
                  {child.name}
                </Link>
              ))}
            </div>
          )}
        </div>

        <PostGrid posts={posts} className="mb-8" />

        <Pagination
          currentPage={pagination.page}
          totalPages={pagination.pageCount}
          baseUrl={`/category/${slug}`}
        />
      </div>
    );
  } catch (err) {
    console.error('Failed to load category:', err);
    notFound();
  }
}
