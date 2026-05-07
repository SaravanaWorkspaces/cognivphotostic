import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getPostBySlug, getPosts } from '@/lib/api';
import { config } from '@/lib/config';
import { Post } from '@/types';
import CategoryBadge from '@/components/ui/CategoryBadge';
import TagList from '@/components/ui/TagList';
import BlockRenderer from '@/components/blog/blocks/BlockRenderer';
import ZoomableHero from '@/components/blog/ZoomableHero';
import { mediaUrl } from '@/lib/media';
import { cleanRichText, splitIntro } from '@/lib/html-clean';

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

    const imageUrl = mediaUrl(post.coverImage?.url) || 'https://via.placeholder.com/1200x600';
    const category = post.category;

    // Promote the body's first paragraph to the lead/excerpt so we don't
    // show it twice. The saved `post.excerpt` is still used for the
    // `<meta description>` (set above).
    const firstTextBlockIdx = post.blocks?.findIndex(b => b.__component === 'blocks.text') ?? -1;
    const firstTextBlock = firstTextBlockIdx >= 0 ? post.blocks?.[firstTextBlockIdx] : undefined;
    const firstBlockBodyRaw =
      firstTextBlock && 'body' in firstTextBlock ? (firstTextBlock.body ?? '') : '';
    const { intro: displayExcerpt, rest: firstBlockBodyRest } = splitIntro(
      cleanRichText(firstBlockBodyRaw),
    );

    const publishDate = new Date(post.publishedAt).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    return (
      <article className="w-full">
        {/* Hero Image (click to zoom) */}
        <div className="mb-8">
          <ZoomableHero src={imageUrl} alt={post.title} />
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

            <p className="text-xl text-gray-600 mb-6">{displayExcerpt}</p>

            {post.tags && post.tags.length > 0 && (
              <TagList tags={post.tags} className="mb-6" />
            )}
          </div>

          {/* Body with Blocks */}
          {post.blocks && post.blocks.length > 0 && (
            <div
              className={
                'prose prose-lg max-w-none mb-12 ' +
                'prose-headings:font-sans prose-headings:font-bold ' +
                'prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4 ' +
                'prose-h3:text-lg prose-h3:mt-6 prose-h3:mb-2 ' +
                'prose-p:text-gray-700 prose-li:text-gray-700 ' +
                'prose-a:text-brand-600 hover:prose-a:text-brand-700 ' +
                'prose-hr:my-10 prose-ul:my-3 prose-li:my-1'
              }
            >
              {post.blocks.map((block, idx) => {
                // For the first text block, the lead paragraph has already
                // been rendered above as the excerpt. Render only the rest.
                if (idx === firstTextBlockIdx && block.__component === 'blocks.text') {
                  if (!firstBlockBodyRest.trim()) return null;
                  const trimmed = { ...block, body: firstBlockBodyRest };
                  return <BlockRenderer key={block.id || idx} block={trimmed} postId={postNumericId} />;
                }
                return <BlockRenderer key={block.id || idx} block={block} postId={postNumericId} />;
              })}
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
