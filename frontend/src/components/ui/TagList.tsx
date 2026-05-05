import { Tag, StrapiItem } from '@/types';

interface TagListProps {
  tags: StrapiItem<Tag>[];
  className?: string;
}

export default function TagList({ tags, className = '' }: TagListProps) {
  if (!tags || tags.length === 0) return null;

  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {tags.map((tag) => (
        <span
          key={tag.id}
          className="inline-block px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded hover:bg-gray-200 transition-colors"
        >
          #{tag.name}
        </span>
      ))}
    </div>
  );
}
