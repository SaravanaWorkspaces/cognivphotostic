import { TextBlock as TextBlockType } from '@/types';

interface TextBlockProps {
  block: TextBlockType;
}

export default function TextBlock({ block }: TextBlockProps) {
  return (
    <div className="prose prose-lg max-w-none">
      <div
        dangerouslySetInnerHTML={{ __html: block.body }}
      />
    </div>
  );
}
