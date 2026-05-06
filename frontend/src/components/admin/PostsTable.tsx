'use client';

import { useState, useMemo, useTransition } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export interface AdminPostRow {
  id: number;
  documentId: string;
  title: string;
  slug: string;
  author: string;
  categoryName: string | null;
  thumbnailUrl: string | null;
  published: boolean;
  updatedAt: string;
}

interface Props {
  initialPosts: AdminPostRow[];
}

function timeAgo(iso: string) {
  const ms = Date.now() - new Date(iso).getTime();
  const min = Math.floor(ms / 60000);
  if (min < 1) return 'just now';
  if (min < 60) return `${min}m ago`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr}h ago`;
  const d = Math.floor(hr / 24);
  if (d < 7) return `${d}d ago`;
  return new Date(iso).toLocaleDateString();
}

export default function PostsTable({ initialPosts }: Props) {
  const router = useRouter();
  const [posts, setPosts] = useState(initialPosts);
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'published' | 'draft'>('all');
  const [busyId, setBusyId] = useState<string | null>(null);
  const [confirming, setConfirming] = useState<AdminPostRow | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return posts.filter(p => {
      if (filter === 'published' && !p.published) return false;
      if (filter === 'draft' && p.published) return false;
      if (q && !p.title.toLowerCase().includes(q) && !p.slug.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [posts, query, filter]);

  // ── Actions ────────────────────────────────────────────────────────────────
  const togglePublish = async (post: AdminPostRow) => {
    setError(null);
    setBusyId(post.documentId);
    try {
      const res = await fetch(`/api/admin/posts/${post.documentId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          publishedAt: post.published ? null : new Date().toISOString(),
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error ?? `Failed (${res.status})`);
      } else {
        setPosts(prev =>
          prev.map(p =>
            p.documentId === post.documentId ? { ...p, published: !p.published } : p,
          ),
        );
        startTransition(() => router.refresh());
      }
    } catch {
      setError('Network error.');
    } finally {
      setBusyId(null);
    }
  };

  const confirmDelete = async () => {
    if (!confirming) return;
    setError(null);
    setBusyId(confirming.documentId);
    const target = confirming;
    setConfirming(null);
    try {
      const res = await fetch(`/api/admin/posts/${target.documentId}`, { method: 'DELETE' });
      if (!res.ok && res.status !== 204) {
        const data = await res.json().catch(() => ({}));
        setError(data.error ?? `Failed (${res.status})`);
      } else {
        setPosts(prev => prev.filter(p => p.documentId !== target.documentId));
        startTransition(() => router.refresh());
      }
    } catch {
      setError('Network error.');
    } finally {
      setBusyId(null);
    }
  };

  const tabBtn = (key: typeof filter, label: string, count: number) => (
    <button
      key={key}
      type="button"
      onClick={() => setFilter(key)}
      className={
        'px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ' +
        (filter === key
          ? 'bg-gray-900 text-white'
          : 'bg-gray-100 text-gray-600 hover:bg-gray-200')
      }
    >
      {label} <span className="opacity-60">({count})</span>
    </button>
  );

  const pubCount = posts.filter(p => p.published).length;
  const draftCount = posts.length - pubCount;

  return (
    <>
      {/* Toolbar */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm mb-4 p-3 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[220px]">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search posts…"
            className="w-full pl-9 pr-3 py-2 rounded-lg border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-400 focus:border-transparent"
          />
        </div>
        <div className="flex items-center gap-1.5">
          {tabBtn('all', 'All', posts.length)}
          {tabBtn('published', 'Published', pubCount)}
          {tabBtn('draft', 'Drafts', draftCount)}
        </div>
      </div>

      {error && (
        <div className="mb-4 flex items-center gap-2 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
          <span>✕</span><span>{error}</span>
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {filtered.length === 0 ? (
          <div className="p-12 text-center">
            <div className="text-5xl mb-3">📝</div>
            <h3 className="font-semibold text-gray-900">No posts found</h3>
            <p className="text-sm text-gray-500 mt-1">
              {posts.length === 0 ? 'Create your first post to get started.' : 'Try a different search or filter.'}
            </p>
            {posts.length === 0 && (
              <Link
                href="/admin/posts/new"
                className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-brand-600 text-white text-sm font-medium rounded-lg hover:bg-brand-700"
              >
                Create Post
              </Link>
            )}
          </div>
        ) : (
          <ul className="divide-y divide-gray-100">
            {filtered.map(post => {
              const busy = busyId === post.documentId;
              return (
                <li key={post.documentId} className="p-4 sm:p-5 flex flex-wrap sm:flex-nowrap items-center gap-4 hover:bg-gray-50 transition-colors">
                  {/* Thumbnail */}
                  <div className="w-16 h-16 rounded-lg bg-gray-100 overflow-hidden shrink-0 ring-1 ring-gray-100">
                    {post.thumbnailUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={post.thumbnailUrl} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-300">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                        </svg>
                      </div>
                    )}
                  </div>

                  {/* Title block */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                      <h3 className="font-semibold text-gray-900 truncate">{post.title}</h3>
                      <span
                        className={
                          'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium border ' +
                          (post.published
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : 'bg-amber-50 text-amber-700 border-amber-200')
                        }
                      >
                        <span className={'w-1.5 h-1.5 rounded-full ' + (post.published ? 'bg-emerald-500' : 'bg-amber-500')} />
                        {post.published ? 'Published' : 'Draft'}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 truncate font-mono">/blog/{post.slug || '—'}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      {post.categoryName ? <>in <span className="font-medium text-gray-600">{post.categoryName}</span> · </> : null}
                      by {post.author} · updated {timeAgo(post.updatedAt)}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1.5 ml-auto">
                    {post.published && post.slug && (
                      <Link
                        href={`/blog/${post.slug}`}
                        target="_blank"
                        className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors"
                        title="View on site"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </Link>
                    )}

                    <button
                      type="button"
                      onClick={() => togglePublish(post)}
                      disabled={busy}
                      className={
                        'px-2.5 py-1.5 text-xs font-medium rounded-lg transition-colors disabled:opacity-50 ' +
                        (post.published
                          ? 'bg-amber-50 text-amber-700 hover:bg-amber-100'
                          : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100')
                      }
                      title={post.published ? 'Unpublish (move to drafts)' : 'Publish now'}
                    >
                      {busy ? '…' : post.published ? 'Unpublish' : 'Publish'}
                    </button>

                    <Link
                      href={`/admin/posts/${post.documentId}/edit`}
                      className="px-2.5 py-1.5 text-xs font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      Edit
                    </Link>

                    <button
                      type="button"
                      onClick={() => setConfirming(post)}
                      disabled={busy}
                      className="p-2 rounded-lg text-gray-400 hover:bg-red-50 hover:text-red-600 transition-colors disabled:opacity-50"
                      title="Delete"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                      </svg>
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {/* Delete confirmation modal */}
      {confirming && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6">
            <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 rounded-full bg-red-100">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-center text-gray-900">Delete this post?</h3>
            <p className="text-sm text-gray-500 text-center mt-1.5">
              <span className="font-medium text-gray-700">{confirming.title}</span> will be permanently deleted. This cannot be undone.
            </p>
            <div className="flex gap-2 mt-6">
              <button
                type="button"
                onClick={() => setConfirming(null)}
                className="flex-1 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                className="flex-1 py-2.5 text-sm font-semibold text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
