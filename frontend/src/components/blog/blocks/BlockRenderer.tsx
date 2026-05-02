import { ContentBlock } from '@/types';
import TextBlock from './TextBlock';
import ImageBlock from './ImageBlock';
import GalleryBlock from './GalleryBlock';
import ProductEmbed from './ProductEmbed';
import ComparisonTable from './ComparisonTable';

interface BlockRendererProps {
  block: ContentBlock;
  postId?: number;
}

export default function BlockRenderer({ block, postId }: BlockRendererProps) {
  switch (block.__component) {
    case 'blocks.text':
      return <TextBlock block={block} />;
    case 'blocks.image':
      return <ImageBlock block={block} />;
    case 'blocks.gallery':
      return <GalleryBlock block={block} />;
    case 'blocks.product-embed':
      return <ProductEmbed block={block} postId={postId} />;
    case 'blocks.comparison-table':
      return <ComparisonTable block={block} />;
    default:
      return null;
  }
}
