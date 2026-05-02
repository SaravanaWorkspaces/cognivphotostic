import { config } from './config';
import type {
  StrapiListResponse,
  StrapiSingleResponse,
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

const POST_POPULATE = {
  populate: {
    coverImage: { fields: ['url', 'alternativeText', 'width', 'height', 'formats'] },
    category: { fields: ['name', 'slug'] },
    tags: { fields: ['name', 'slug'] },
    seo: {
      populate: {
        ogImage: { fields: ['url', 'width', 'height'] },
      },
    },
  },
};

export async function getPosts(params?: {
  page?: number;
  pageSize?: number;
  category?: string;
  tag?: string;
}): Promise<StrapiListResponse<Post>> {
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

  return fetchStrapi<StrapiListResponse<Post>>(`/posts${query}`, {
    revalidate: config.revalidate.posts,
    tags: ['posts', ...(category ? [`category:${category}`] : [])],
  });
}

export async function getPostBySlug(slug: string): Promise<StrapiSingleResponse<Post> | null> {
  const query = qs({
    ...POST_POPULATE,
    populate: {
      ...POST_POPULATE.populate,
      blocks: {
        populate: {
          image: { fields: ['url', 'alternativeText', 'width', 'height'] },
          images: { fields: ['url', 'alternativeText', 'width', 'height'] },
          product: {
            populate: {
              image: { fields: ['url', 'alternativeText', 'width', 'height'] },
            },
          },
          rows: '*',
        },
      },
    },
    filters: { slug: { $eq: slug } },
  });

  const res = await fetchStrapi<StrapiListResponse<Post>>(`/posts${query}`, {
    revalidate: config.revalidate.posts,
    tags: [`post:${slug}`],
  });

  if (!res.data.length) return null;

  return { data: res.data[0], meta: {} };
}

// ─── Categories ───────────────────────────────────────────────────────────────

export async function getCategories(): Promise<StrapiListResponse<Category>> {
  const query = qs({ fields: ['name', 'slug', 'description'] });

  return fetchStrapi<StrapiListResponse<Category>>(`/categories${query}`, {
    revalidate: config.revalidate.categories,
    tags: ['categories'],
  });
}

export async function getCategoryBySlug(slug: string): Promise<StrapiSingleResponse<Category> | null> {
  const query = qs({ filters: { slug: { $eq: slug } } });

  const res = await fetchStrapi<StrapiListResponse<Category>>(`/categories${query}`, {
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
}): Promise<StrapiListResponse<Product>> {
  const { page = 1, pageSize = config.pagination.pageSize } = params ?? {};

  const query = qs({
    populate: {
      image: { fields: ['url', 'alternativeText', 'width', 'height', 'formats'] },
    },
    pagination: { page, pageSize },
  });

  return fetchStrapi<StrapiListResponse<Product>>(`/products${query}`, {
    revalidate: config.revalidate.posts,
    tags: ['products'],
  });
}

export async function getProductBySlug(slug: string): Promise<StrapiSingleResponse<Product> | null> {
  const query = qs({
    populate: {
      image: { fields: ['url', 'alternativeText', 'width', 'height'] },
    },
    filters: { slug: { $eq: slug } },
  });

  const res = await fetchStrapi<StrapiListResponse<Product>>(`/products${query}`, {
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
