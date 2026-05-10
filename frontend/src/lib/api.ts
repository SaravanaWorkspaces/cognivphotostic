import { config } from './config';
import type {
  StrapiListResponse,
  StrapiSingleResponse,
  StrapiItem,
  Post,
  Category,
  Tag,
  Product,
} from '@/types';

// ─── Core fetch wrapper ───────────────────────────────────────────────────────

interface FetchOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  body?: unknown;
  revalidate?: number;
  tags?: string[];
  noCache?: boolean;
}

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export async function fetchStrapi<T>(
  path: string,
  options: FetchOptions = {},
): Promise<T> {
  const { method = 'GET', body, revalidate, tags, noCache = false } = options;

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  if (config.strapi.apiToken) {
    headers['Authorization'] = `Bearer ${config.strapi.apiToken}`;
  }

  const nextOptions: { revalidate?: number; tags?: string[] } = {};
  if (revalidate !== undefined) nextOptions.revalidate = revalidate;
  if (tags?.length) nextOptions.tags = tags;

  const res = await fetch(`${config.strapi.url}/api${path}`, {
    method,
    headers,
    ...(body ? { body: JSON.stringify(body) } : {}),
    ...(noCache
      ? { cache: 'no-store' }
      : { next: nextOptions }),
  });

  if (!res.ok) {
    throw new ApiError(res.status, `Strapi ${method} ${path} → ${res.status} ${res.statusText}`);
  }

  return res.json() as Promise<T>;
}

// ─── Query builder helpers ────────────────────────────────────────────────────

function qs(params: Record<string, unknown>): string {
  const pairs: string[] = [];

  function flatten(obj: unknown, prefix: string) {
    if (obj === null || obj === undefined) return;
    if (typeof obj === 'object' && !Array.isArray(obj)) {
      for (const [k, v] of Object.entries(obj as Record<string, unknown>)) {
        flatten(v, prefix ? `${prefix}[${k}]` : k);
      }
    } else if (Array.isArray(obj)) {
      obj.forEach((v, i) => flatten(v, `${prefix}[${i}]`));
    } else {
      pairs.push(`${encodeURIComponent(prefix)}=${encodeURIComponent(String(obj))}`);
    }
  }

  flatten(params, '');
  return pairs.length ? `?${pairs.join('&')}` : '';
}

// ─── Posts ────────────────────────────────────────────────────────────────────

// Strapi 5: `populate=*` only fills top-level relations and does NOT recurse
// into dynamic-zone components. We need an explicit per-component populate so
// each block's own relations (cover image inside blocks.image, product inside
// blocks.product-embed, etc.) come back with the post.
const POST_POPULATE = {
  populate: {
    coverImage: true,
    category: true,
    tags: true,
    products: true,
    seo: { populate: '*' },
    blocks: {
      on: {
        'blocks.text': { populate: '*' },
        'blocks.image': { populate: '*' },
        'blocks.gallery': { populate: '*' },
        'blocks.product-embed': { populate: { product: { populate: '*' } } },
        'blocks.comparison-table': { populate: '*' },
      },
    },
  },
};

export async function getPosts(params?: {
  page?: number;
  pageSize?: number;
  category?: string;
  tag?: string;
}): Promise<StrapiListResponse<StrapiItem<Post>>> {
  const { page = 1, pageSize = config.pagination.pageSize, category, tag } = params ?? {};

  const filters: Record<string, unknown> = {
    publishedAt: { $notNull: true },
    ...(category ? { category: { slug: { $eq: category } } } : {}),
    ...(tag ? { tags: { slug: { $eq: tag } } } : {}),
  };

  const query = qs({
    ...POST_POPULATE,
    sort: ['publishedAt:desc'],
    filters,
    pagination: { page, pageSize },
  });

  return fetchStrapi<StrapiListResponse<StrapiItem<Post>>>(`/posts${query}`, {
    revalidate: config.revalidate.posts,
    tags: ['posts', ...(category ? [`category:${category}`] : [])],
  });
}

export async function getPostBySlug(slug: string): Promise<StrapiSingleResponse<StrapiItem<Post>> | null> {
  const query = qs({
    ...POST_POPULATE,
    filters: { slug: { $eq: slug } },
  });

  const res = await fetchStrapi<StrapiListResponse<StrapiItem<Post>>>(`/posts${query}`, {
    revalidate: config.revalidate.posts,
    tags: [`post:${slug}`],
  });

  if (!res.data.length) return null;

  return { data: res.data[0], meta: {} };
}

// ─── Categories ───────────────────────────────────────────────────────────────

export async function getCategories(opts?: {
  topLevelOnly?: boolean;
}): Promise<StrapiListResponse<StrapiItem<Category>>> {
  const query = qs({
    pagination: { pageSize: 100 },
    sort: ['name:asc'],
    populate: { parent: { fields: ['slug'] } },
    ...(opts?.topLevelOnly
      ? { filters: { parent: { id: { $null: true } } } }
      : {}),
  });

  return fetchStrapi<StrapiListResponse<StrapiItem<Category>>>(`/categories${query}`, {
    revalidate: config.revalidate.categories,
    tags: ['categories'],
  });
}

export async function getTags(): Promise<StrapiListResponse<StrapiItem<Tag>>> {
  const query = qs({ pagination: { pageSize: 200 }, sort: ['name:asc'] });

  return fetchStrapi<StrapiListResponse<StrapiItem<Tag>>>(`/tags${query}`, {
    revalidate: config.revalidate.categories,
    tags: ['tags'],
  });
}

export async function getCategoryBySlug(slug: string): Promise<StrapiSingleResponse<StrapiItem<Category>> | null> {
  const query = qs({
    filters: { slug: { $eq: slug } },
    populate: {
      parent: { fields: ['name', 'slug'] },
      children: { fields: ['name', 'slug'], sort: ['name:asc'] },
    },
  });

  const res = await fetchStrapi<StrapiListResponse<StrapiItem<Category>>>(`/categories${query}`, {
    revalidate: config.revalidate.categories,
    tags: ['categories'],
  });

  if (!res.data.length) return null;

  return { data: res.data[0], meta: {} };
}

// ─── Products ─────────────────────────────────────────────────────────────────

export async function getProducts(params?: {
  page?: number;
  pageSize?: number;
}): Promise<StrapiListResponse<StrapiItem<Product>>> {
  const { page = 1, pageSize = config.pagination.pageSize } = params ?? {};

  const query = qs({
    populate: '*',
    pagination: { page, pageSize },
  });

  return fetchStrapi<StrapiListResponse<StrapiItem<Product>>>(`/products${query}`, {
    revalidate: config.revalidate.posts,
    tags: ['products'],
  });
}

export async function getProductBySlug(slug: string): Promise<StrapiSingleResponse<StrapiItem<Product>> | null> {
  const query = qs({
    populate: '*',
    filters: { slug: { $eq: slug } },
  });

  const res = await fetchStrapi<StrapiListResponse<StrapiItem<Product>>>(`/products${query}`, {
    revalidate: 3600,
    tags: [`product:${slug}`],
  });

  if (!res.data.length) return null;

  return { data: res.data[0], meta: {} };
}

// ─── Affiliate click tracking (server action / route handler) ─────────────────

export async function trackAffiliateClick(payload: {
  productId: number;
  postId?: number;
  url: string;
}): Promise<void> {
  await fetchStrapi('/affiliate-clicks', {
    method: 'POST',
    body: { data: payload },
    noCache: true,
  });
}
