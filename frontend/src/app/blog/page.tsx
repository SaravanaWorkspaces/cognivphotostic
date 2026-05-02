import { Metadata } from 'next';
import { getPosts } from '@/lib/api';
import { config } from '@/lib/config';
import PostGrid from '@/components/blog/PostGrid';
import Pagination from '@/components/blog/Pagination';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Explore our collection of home decor and interior design articles.',
};

interface BlogPageProps {
  searchParams: Promise<{ page?: string }>;
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const params = await searchParams;
  const page = parseInt(params.page || '1', 10);

  try {
    const response = await getPosts({
      page,
      pageSize: config.pagination.pageSize,
    });

    const posts = response.data || [];
    const pagination = response.meta.pagination;

    return (
      <div className="container-wide py-12">
        <div className="mb-8">
          <h1 className="font-serif text-4xl font-bold text-gray-900 mb-2">
            Blog
          </h1>
          <p className="text-lg text-gray-600">
            Discover inspiring home decor ideas and interior design tips.
          </p>
        </div>

        <PostGrid posts={posts} className="mb-8" />

        <Pagination
          currentPage={pagination.page}
          totalPages={pagination.pageCount}
          baseUrl="/blog"
        />
      </div>
    );
  } catch (err) {
    console.error('Failed to load blog posts:', err);
    return (
      <div className="container-wide py-12 text-center">
        <p className="text-red-600">Failed to load blog posts. Please try again later.</p>
      </div>
    );
  }
}
