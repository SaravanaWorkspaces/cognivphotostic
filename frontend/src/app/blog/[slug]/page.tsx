import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getPostBySlug, getPosts } from '@/lib/api';
import { config } from '@/lib/config';
import { Post } from '@/types';
import CategoryBadge from '@/components/ui/CategoryBadge';
import TagList from '@/components/ui/TagList';
import BlockRenderer from '@/components/blog/blocks/BlockRenderer';

export const revalidate = 3600;

export async function generateStaticParams() {
  try {
    const response = await getPosts({ pageSize: 100 });
    return (response.data || [])
      .filter((post) => post.slug)
      .map((post) => ({
        slug: post.slug,
      }));
  } catch (err) {
    console.error('Failed to generate static params:', err);
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
    const response = await getPostBySlug(slug);
    if (!response?.data) {
      return { title: 'Post not found' };
    }
    const post = response.data as Post;

    return {
      title: post.title,
      description: post.excerpt,
      openGraph: {
        title: post.title,
        description: post.excerpt,
        url: `${config.site.url}/blog/${slug}`,
      },
    };
  } catch (err) {
    console.error('Failed to generate metadata:', err);
    return { title: 'Post' };
  }
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  try {
    const response = await getPostBySlug(slug);
    if (!response?.data) {
      notFound();
    }
    const post = response.data as Post;
    const postNumericId = response.data.id;

    const imageUrl = post.coverImage?.url || 'https://via.placeholder.com/1200x600';
    const category = post.category;

    const publishDate = new Date(post.publishedAt).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    return (
      <article className="w-full">
        {/* Hero Image */}
        <div className="relative w-full h-96 bg-gray-100 mb-8">
          <Image
            src={imageUrl}
            alt={post.title}
            fill
            priority
            className="object-cover"
          />
        </div>

        {/* Article Content */}
        <div className="container-prose">
          {/* Header */}
          <div className="mb-8">
            <div className="flex flex-wrap items-center gap-3 mb-4">
              {category && (
                <CategoryBadge name={category.name} slug={category.slug} />
              )}
              <time className="text-sm text-gray-500">{publishDate}</time>
            </div>

            <h1 className="font-serif text-4xl font-bold text-gray-900 mb-4">
              {post.title}
            </h1>

            <p className="text-xl text-gray-600 mb-6">{post.excerpt}</p>

            {post.tags && post.tags.length > 0 && (
              <TagList tags={post.tags} className="mb-6" />
            )}
          </div>

          {/* Body with Blocks */}
          {post.blocks && post.blocks.length > 0 && (
            <div className="prose prose-lg max-w-none mb-12">
              {post.blocks.map((block, idx) => (
                <BlockRenderer key={block.id || idx} block={block} postId={postNumericId} />
              ))}
            </div>
          )}

          {/* Footer Navigation */}
          <nav className="border-t border-gray-200 pt-8 mt-12">
            <Link
              href="/blog"
              className="inline-block px-4 py-2 text-brand-600 hover:text-brand-700 font-medium"
            >
              ← Back to Blog
            </Link>
          </nav>
        </div>
      </article>
    );
  } catch (err) {
    console.error('Failed to load post:', err);
    notFound();
  }
}
