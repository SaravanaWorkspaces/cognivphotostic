import { NextResponse } from 'next/server';
import { config } from '@/lib/config';

// Proxies GET /api/strapi/upload/files?... → Strapi /api/upload/files?...
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const headers: HeadersInit = {};
  if (config.strapi.apiToken) {
    headers['Authorization'] = `Bearer ${config.strapi.apiToken}`;
  }

  const qs = searchParams.toString();
  const url = `${config.strapi.url}/api/upload/files${qs ? `?${qs}` : ''}`;

  try {
    const res = await fetch(url, { headers, cache: 'no-store' });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Proxy error' },
      { status: 500 }
    );
  }
}
