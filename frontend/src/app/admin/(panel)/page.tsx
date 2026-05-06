import Link from 'next/link';
import { auth } from '@/auth';
import { config } from '@/lib/config';

export const dynamic = 'force-dynamic';

interface Counts {
  total: number;
  published: number;
  drafts: number;
}

async function getCounts(strapiToken: string): Promise<Counts> {
  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${strapiToken}`,
  };

  // status=draft returns the latest version of every entry (incl. unpublished)
  const all = await fetch(
    `${config.strapi.url}/api/posts?status=draft&pagination[pageSize]=1&fields[0]=id`,
    { headers, cache: 'no-store' },
  ).then(r => (r.ok ? r.json() : { meta: { pagination: { total: 0 } } }));

  const published = await fetch(
    `${config.strapi.url}/api/posts?status=published&pagination[pageSize]=1&fields[0]=id`,
    { headers, cache: 'no-store' },
  ).then(r => (r.ok ? r.json() : { meta: { pagination: { total: 0 } } }));

  const total = all?.meta?.pagination?.total ?? 0;
  const pubTotal = published?.meta?.pagination?.total ?? 0;

  return {
    total,
    published: pubTotal,
    drafts: Math.max(0, total - pubTotal),
  };
}

export default async function AdminDashboard() {
  const session = await auth();
  const strapiToken = session?.user?.strapiToken ?? config.strapi.apiToken ?? '';

  let counts: Counts | null = null;
  let loadError: string | null = null;
  try {
    counts = await getCounts(strapiToken);
  } catch {
    loadError = 'Could not reach the backend. Make sure Strapi is running.';
  }

  const stats = [
    { label: 'Total Posts',     value: counts?.total ?? 0,     accent: 'from-brand-500 to-brand-700' },
    { label: 'Published',       value: counts?.published ?? 0, accent: 'from-emerald-500 to-emerald-700' },
    { label: 'Drafts',          value: counts?.drafts ?? 0,    accent: 'from-amber-500 to-amber-700' },
  ];

  return (
    <div className="px-6 sm:px-8 py-6 sm:py-8 max-w-6xl mx-auto">
      <div className="flex items-start justify-between flex-wrap gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Welcome back{session?.user?.name ? `, ${session.user.name.split(' ')[0]}` : ''} 👋
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage posts, publish drafts, and keep your blog fresh.
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

      {loadError && (
        <div className="mb-6 flex items-center gap-2 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
          <span>✕</span><span>{loadError}</span>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
        {stats.map(s => (
          <div key={s.label} className="relative overflow-hidden bg-white rounded-2xl border border-gray-100 shadow-sm">
            <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${s.accent}`} />
            <div className="p-5">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">{s.label}</p>
              <p className="text-3xl font-bold text-gray-900 mt-1.5">{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link
          href="/admin/posts"
          className="group bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all"
        >
          <div className="flex items-start gap-4">
            <div className="w-11 h-11 rounded-xl bg-brand-50 flex items-center justify-center group-hover:bg-brand-100 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-brand-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900">Manage Posts</h3>
              <p className="text-sm text-gray-500 mt-0.5">View, edit, publish, or delete existing posts.</p>
            </div>
            <span className="text-gray-300 group-hover:text-gray-500 transition-colors">→</span>
          </div>
        </Link>

        <Link
          href="/admin/posts/new"
          className="group bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all"
        >
          <div className="flex items-start gap-4">
            <div className="w-11 h-11 rounded-xl bg-emerald-50 flex items-center justify-center group-hover:bg-emerald-100 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900">Create New Post</h3>
              <p className="text-sm text-gray-500 mt-0.5">Write and publish a new blog post.</p>
            </div>
            <span className="text-gray-300 group-hover:text-gray-500 transition-colors">→</span>
          </div>
        </Link>
      </div>
    </div>
  );
}
