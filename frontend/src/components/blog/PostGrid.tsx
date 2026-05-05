import { Post, StrapiItem } from '@/types';
import PostCard from './PostCard';

interface PostGridProps {
  posts: StrapiItem<Post>[];
  className?: string;
}

export default function PostGrid({ posts, className = '' }: PostGridProps) {
  if (!posts || posts.length === 0) {
    return (
      <div className={`text-center py-12 ${className}`}>
        <p className="text-gray-600">No posts found.</p>
      </div>
    );
  }

  return (
    <div
      className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ${className}`}
    >
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
}
