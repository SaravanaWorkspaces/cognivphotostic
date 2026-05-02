import { Metadata } from 'next';
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
      .filter((cat) => cat.attributes?.slug)
      .map((cat) => ({
        slug: cat.attributes.slug,
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
    const category = response.data.attributes as Category;

    return {
      title: `${category.name} - Home Decor & Interior Design`,
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
    const category = categoryResponse.data.attributes as Category;

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
          <h1 className="font-serif text-4xl font-bold text-gray-900 mb-2">
            {category.name}
          </h1>
          {category.description && (
            <p className="text-lg text-gray-600">{category.description}</p>
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
