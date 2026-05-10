export const config = {
  strapi: {
    url: process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337',
    // Server-only — never pass to client components
    apiToken: process.env.STRAPI_API_TOKEN,
  },
  site: {
    url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
    name: 'CognivPhotostic',
    description: 'Interior, lifestyle and fashion stories with a South Indian soul',
  },
  pagination: {
    pageSize: 12,
  },
  revalidate: {
    posts: 3600,       // 1 hour
    categories: 86400, // 24 hours
    homepage: 1800,    // 30 min
  },
} as const;
