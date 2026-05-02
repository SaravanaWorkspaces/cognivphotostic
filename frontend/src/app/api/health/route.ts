import { NextResponse } from 'next/server';
import { config } from '@/lib/config';

export const dynamic = 'force-dynamic';

export async function GET() {
  let strapiStatus: 'ok' | 'error' = 'error';

  try {
    const res = await fetch(`${config.strapi.url}/_health`, {
      cache: 'no-store',
      signal: AbortSignal.timeout(3000),
    });
    strapiStatus = res.ok ? 'ok' : 'error';
  } catch {
    strapiStatus = 'error';
  }

  return NextResponse.json({
    status: 'ok',
    strapi: strapiStatus,
    timestamp: new Date().toISOString(),
  });
}
