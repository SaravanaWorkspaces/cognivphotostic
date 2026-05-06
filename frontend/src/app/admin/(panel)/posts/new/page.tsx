import Link from 'next/link';
import PostForm from '@/components/admin/PostForm';

export const dynamic = 'force-dynamic';

export default function NewPostPage() {
  return (
    <div className="px-6 sm:px-8 py-6 sm:py-8 max-w-3xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/admin/posts" className="text-gray-400 hover:text-gray-700 text-sm">← Back to posts</Link>
      </div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">New Post</h1>
        <p className="text-sm text-gray-500 mt-1">Fill the details below and publish or save as a draft.</p>
      </div>
      <PostForm mode="create" />
    </div>
  );
}
