// ─── Strapi base wrapper types ───────────────────────────────────────────────

export interface StrapiSingleResponse<T> {
  data: StrapiItem<T>;
  meta: Record<string, unknown>;
}

export interface StrapiListResponse<T> {
  data: StrapiItem<T>[];
  meta: StrapiPaginationMeta;
}

export interface StrapiItem<T> {
  id: number;
  attributes: T;
}

export interface StrapiPaginationMeta {
  pagination: {
    page: number;
    pageSize: number;
    pageCount: number;
    total: number;
  };
}

export interface StrapiMedia {
  data: {
    id: number;
    attributes: {
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
    };
  } | null;
}

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
  coverImage: StrapiMedia;
  category: StrapiSingleResponse<Category>;
  tags: StrapiListResponse<Tag>;
  blocks?: ContentBlock[];
  seo: SEO | null;
}

export interface Category {
  name: string;
  slug: string;
  description: string | null;
  posts?: StrapiListResponse<Post>;
}

export interface Tag {
  name: string;
  slug: string;
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
  product: StrapiSingleResponse<Product>;
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
