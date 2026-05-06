import Link from 'next/link';
import { auth } from '@/auth';
import { config } from '@/lib/config';
import PostsTable, { type AdminPostRow } from '@/components/admin/PostsTable';

export const dynamic = 'force-dynamic';

interface RawPost {
  id: number;
  documentId: string;
  title?: string;
  slug?: string;
  publishedAt?: string | null;
  updatedAt?: string;
  createdAt?: string;
  author?: string;
  category?: { name?: string } | null;
  coverImage?: { url?: string; formats?: { thumbnail?: { url?: string } } } | null;
}

async function getPosts(strapiToken: string): Promise<{ posts: AdminPostRow[]; error?: string }> {
  try {
    // status=draft returns the latest version of every entry (drafts AND
    // already-published items appear in the result).
    const url =
      `${config.strapi.url}/api/posts` +
      `?status=draft` +
      `&populate[coverImage][fields][0]=url` +
      `&populate[coverImage][populate]=formats` +
      `&populate[category][fields][0]=name` +
      `&sort[0]=updatedAt:desc` +
      `&pagination[pageSize]=100`;

    const res = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${strapiToken}`,
      },
      cache: 'no-store',
    });

    if (!res.ok) {
      return { posts: [], error: `Backend returned ${res.status}` };
    }

    const json = await res.json();
    const data: RawPost[] = json.data ?? [];
    const base = config.strapi.url;

    const posts: AdminPostRow[] = data.map(p => {
      const thumb =
        p.coverImage?.formats?.thumbnail?.url ?? p.coverImage?.url ?? null;
      const thumbnailUrl = thumb
        ? thumb.startsWith('http') ? thumb : `${base}${thumb}`
        : null;

      return {
        id: p.id,
        documentId: p.documentId,
        title: p.title ?? '(untitled)',
        slug: p.slug ?? '',
        author: p.author ?? '—',
        categoryName: p.category?.name ?? null,
        thumbnailUrl,
        published: !!p.publishedAt,
        updatedAt: p.updatedAt ?? p.createdAt ?? new Date().toISOString(),
      };
    });

    return { posts };
  } catch {
    return { posts: [], error: 'Could not reach the backend.' };
  }
}

export default async function AdminPostsPage() {
  const session = await auth();
  const strapiToken = session?.user?.strapiToken ?? config.strapi.apiToken ?? '';
  const { posts, error } = await getPosts(strapiToken);

  return (
    <div className="px-6 sm:px-8 py-6 sm:py-8 max-w-6xl mx-auto">
      <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Posts</h1>
          <p className="text-sm text-gray-500 mt-1">
            {posts.length} {posts.length === 1 ? 'post' : 'posts'} total
          </p>
        </div>
        <Link
          href="/admin/posts/new"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-brand-600 text-white text-sm font-semibold rounded-lg hover:bg-brand-700 transition-colors shadow-sm"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          New Post
        </Link>
      </div>

      {error && (
        <div className="mb-6 flex items-center gap-2 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
          <span>✕</span><span>{error}</span>
        </div>
      )}

      <PostsTable initialPosts={posts} />
    </div>
  );
}
