import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { config } from '@/lib/config';

export async function POST(request: Request) {
  // Verify session — middleware already blocks unauthenticated access,
  // but this double-check ensures the API itself is never callable without auth.
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Use the per-user Strapi JWT so Strapi enforces its own permissions.
  // Falls back to the static API token only if the session token is missing.
  const strapiToken = session.user.strapiToken ?? config.strapi.apiToken;

  try {
    const body = await request.json();

    const res = await fetch(`${config.strapi.url}/api/posts`, {
      method:  'POST',
      headers: {
        'Content-Type':  'application/json',
        'Authorization': `Bearer ${strapiToken}`,
      },
      body: JSON.stringify({ data: body }),
    });

    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json(
        { error: data?.error?.message ?? `Strapi error ${res.status}` },
        { status: res.status }
      );
    }

    return NextResponse.json(data, { status: 201 });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
