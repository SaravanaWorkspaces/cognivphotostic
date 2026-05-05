// ─── Strapi base wrapper types (Strapi 5 flat structure) ────────────────────

export interface StrapiSingleResponse<T> {
  data: T;
  meta: Record<string, unknown>;
}

export interface StrapiListResponse<T> {
  data: T[];
  meta: StrapiPaginationMeta;
}

export type StrapiItem<T> = T & {
  id: number;
  documentId: string;
};

export interface StrapiPaginationMeta {
  pagination: {
    page: number;
    pageSize: number;
    pageCount: number;
    total: number;
  };
}

export interface StrapiMediaObject {
  id: number;
  documentId: string;
  url: string;
  alternativeText: string | null;
  width: number;
  height: number;
  formats?: {
    thumbnail?: MediaFormat;
    small?: MediaFormat;
    medium?: MediaFormat;
    large?: MediaFormat;
  };
}

export type StrapiMedia = StrapiMediaObject | null;

export interface MediaFormat {
  url: string;
  width: number;
  height: number;
}

// ─── Domain types ─────────────────────────────────────────────────────────────

export interface Post {
  title: string;
  slug: string;
  excerpt: string;
  publishedAt: string;
  updatedAt: string;
  createdAt: string;
  author: string;
  coverImage: StrapiMedia;
  category: StrapiItem<Category> | null;
  tags: StrapiItem<Tag>[];
  blocks?: ContentBlock[];
  seo?: SEO | null;
}

export interface Category {
  name: string;
  slug: string;
  description: string | null;
  createdAt?: string;
  updatedAt?: string;
  publishedAt?: string;
}

export interface Tag {
  name: string;
  slug: string;
  createdAt?: string;
  updatedAt?: string;
  publishedAt?: string;
}

export interface Product {
  name: string;
  slug: string;
  description: string | null;
  affiliateUrl: string;
  price: number | null;
  currency: string;
  image: StrapiMedia;
  commissionRate?: number;
  createdAt?: string;
  updatedAt?: string;
  publishedAt?: string;
}

// ─── SEO ──────────────────────────────────────────────────────────────────────

export interface SEO {
  metaTitle: string;
  metaDescription: string;
  ogImage: StrapiMedia;
  canonicalURL: string | null;
  keywords: string | null;
}

// ─── Content blocks (Dynamic Zone) ───────────────────────────────────────────

export type ContentBlock =
  | TextBlock
  | ImageBlock
  | GalleryBlock
  | ProductEmbedBlock
  | ComparisonTableBlock;

export interface TextBlock {
  __component: 'blocks.text';
  id: number;
  body: string;
}

export interface ImageBlock {
  __component: 'blocks.image';
  id: number;
  image: StrapiMedia;
  caption: string | null;
}

export interface GalleryBlock {
  __component: 'blocks.gallery';
  id: number;
  images: StrapiMedia[];
}

export interface ProductEmbedBlock {
  __component: 'blocks.product-embed';
  id: number;
  product: StrapiItem<Product>;
}

export interface ComparisonTableBlock {
  __component: 'blocks.comparison-table';
  id: number;
  title: string | null;
  rows: ComparisonRow[];
}

export interface ComparisonRow {
  id: number;
  feature: string;
  values: string;
}

// ─── Analytics ────────────────────────────────────────────────────────────────

export interface AffiliateClickPayload {
  productId: number;
  postId?: number;
  url: string;
}
