import Link from 'next/link';
import { getPosts } from '@/lib/api';
import { Post, StrapiItem } from '@/types';
import PostGrid from '@/components/blog/PostGrid';

export const revalidate = 1800;

export default async function HomePage() {
  let featuredPosts: StrapiItem<Post>[] = [];
  try {
    const response = await getPosts({ pageSize: 6 });
    featuredPosts = response.data || [];
  } catch (err) {
    console.error('Failed to load featured posts:', err);
  }

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-brand-50 to-brand-100 py-20">
        <div className="container-wide text-center">
          <h1 className="font-serif text-5xl font-bold text-gray-900 mb-4">
            South Indian Soul, Modern Living
          </h1>
          <p className="text-xl text-gray-700 mb-8 max-w-2xl mx-auto">
            Interiors, fashion and lifestyle stories rooted in the South — from Chettinad courtyards and Kanjivaram silks to filter coffee mornings.
          </p>
          <Link
            href="/blog"
            className="inline-block px-8 py-3 bg-brand-500 text-white font-semibold rounded-lg hover:bg-brand-600 transition-colors"
          >
            Explore the Blog →
          </Link>
        </div>
      </section>

      {/* Featured Posts */}
      <section className="container-wide py-16">
        <div className="mb-12">
          <h2 className="font-serif text-3xl font-bold text-gray-900 mb-2">
            Featured Articles
          </h2>
          <p className="text-lg text-gray-600">
            Fresh stories on interiors, fashion and South Indian living.
          </p>
        </div>

        {featuredPosts.length > 0 ? (
          <>
            <PostGrid posts={featuredPosts} className="mb-8" />
            <div className="text-center">
              <Link
                href="/blog"
                className="text-brand-600 font-semibold hover:text-brand-700"
              >
                View All Articles →
              </Link>
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600 mb-4">No articles yet. Check back soon!</p>
            <Link
              href="/blog"
              className="text-brand-600 font-semibold hover:text-brand-700"
            >
              Visit Blog →
            </Link>
          </div>
        )}
      </section>
    </div>
  );
}
