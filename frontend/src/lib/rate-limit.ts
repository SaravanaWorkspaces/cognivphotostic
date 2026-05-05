interface Bucket { count: number; resetAt: number; }

const store = new Map<string, Bucket>();

const WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const MAX_ATTEMPTS = 5;

// Periodically evict expired entries so the map doesn't grow unboundedly
setInterval(() => {
  const now = Date.now();
  for (const [key, bucket] of store) {
    if (bucket.resetAt <= now) store.delete(key);
  }
}, WINDOW_MS);

export function checkRateLimit(ip: string): { blocked: boolean } {
  const now = Date.now();
  const bucket = store.get(ip);

  if (!bucket || bucket.resetAt <= now) {
    store.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return { blocked: false };
  }

  bucket.count += 1;

  if (bucket.count > MAX_ATTEMPTS) {
    return { blocked: true };
  }

  return { blocked: false };
}

export function resetRateLimit(ip: string) {
  store.delete(ip);
}
