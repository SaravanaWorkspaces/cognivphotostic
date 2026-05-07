import { TextBlock as TextBlockType } from '@/types';
import { cleanRichText } from '@/lib/html-clean';

interface TextBlockProps {
  block: TextBlockType;
}

export default function TextBlock({ block }: TextBlockProps) {
  const html = cleanRichText(block.body ?? '');
  return (
    <div dangerouslySetInnerHTML={{ __html: html }} />
  );
}
