import { config } from './config';

/** Resolve a Strapi media URL (which is stored as a server-relative path
 *  like `/uploads/foo.webp`) to an absolute URL pointing at the Strapi host. */
export function mediaUrl(url?: string | null): string | null {
  if (!url) return null;
  return url.startsWith('http') ? url : `${config.strapi.url}${url}`;
}
