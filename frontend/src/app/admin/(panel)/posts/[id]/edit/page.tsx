import Link from 'next/link';
import { notFound } from 'next/navigation';
import { auth } from '@/auth';
import { config } from '@/lib/config';
import { getCategories, getTags } from '@/lib/api';
import PostForm, { type PostFormInitial } from '@/components/admin/PostForm';

export const dynamic = 'force-dynamic';

interface RawBlock {
  __component: string;
  body?: string;
}

interface RawPost {
  id: number;
  documentId: string;
  title?: string;
  slug?: string;
  publishedAt?: string | null;
  coverImage?: { id: number; url?: string; formats?: { medium?: { url?: string }; small?: { url?: string } } } | null;
  category?: { id: number } | null;
  tags?: Array<{ id: number }>;
  blocks?: RawBlock[];
}

async function loadPost(documentId: string, strapiToken: string): Promise<RawPost | null> {
  const url = `${config.strapi.url}/api/posts/${documentId}?status=draft&populate=*`;
  const res = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${strapiToken}`,
    },
    cache: 'no-store',
  });
  if (!res.ok) return null;
  const json = await res.json();
  return json.data ?? null;
}

export default async function EditPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth();
  const strapiToken = session?.user?.strapiToken ?? config.strapi.apiToken ?? '';

  const [post, catsRes, tagsRes] = await Promise.all([
    loadPost(id, strapiToken),
    getCategories(),
    getTags(),
  ]);
  if (!post) notFound();

  const categories = (catsRes.data ?? []).map(c => ({ id: c.id, name: c.name }));
  const tags = (tagsRes.data ?? []).map(t => ({ id: t.id, name: t.name }));

  const coverUrl =
    post.coverImage?.formats?.medium?.url ??
    post.coverImage?.formats?.small?.url ??
    post.coverImage?.url ??
    null;

  // Merge all text blocks into a single HTML string for the editor.
  const contentHtml = (post.blocks ?? [])
    .filter(b => b.__component === 'blocks.text' && typeof b.body === 'string')
    .map(b => b.body!)
    .join('');

  const initial: PostFormInitial = {
    title:    post.title ?? '',
    slug:     post.slug ?? '',
    coverImageId: post.coverImage?.id ?? null,
    coverPreviewUrl: coverUrl ? (coverUrl.startsWith('http') ? coverUrl : `${config.strapi.url}${coverUrl}`) : null,
    contentHtml,
    isPublished: !!post.publishedAt,
    categoryId: post.category?.id ?? null,
    tagIds: (post.tags ?? []).map(t => t.id),
  };

  return (
    <div className="px-6 sm:px-8 py-6 sm:py-8 max-w-3xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/admin/posts" className="text-gray-400 hover:text-gray-700 text-sm">← Back to posts</Link>
      </div>
      <div className="flex items-start justify-between flex-wrap gap-3 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Edit Post</h1>
          <p className="text-sm text-gray-500 mt-1">
            <span className={
              'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium border ' +
              (initial.isPublished
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                : 'bg-amber-50 text-amber-700 border-amber-200')
            }>
              <span className={'w-1.5 h-1.5 rounded-full ' + (initial.isPublished ? 'bg-emerald-500' : 'bg-amber-500')} />
              {initial.isPublished ? 'Published' : 'Draft'}
            </span>
            <span className="ml-2 font-mono text-xs text-gray-400">/{post.slug}</span>
          </p>
        </div>
      </div>

      <PostForm mode="edit" documentId={post.documentId} initial={initial} categories={categories} tags={tags} />
    </div>
  );
}
