import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { config } from '@/lib/config';

// ─── GET /api/admin/posts ─────────────────────────────────────────────────────
// Lists ALL posts, including drafts (status=draft returns the latest version
// of every entry). Used by the admin posts list page.
export async function GET() {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const strapiToken = session.user.strapiToken ?? config.strapi.apiToken;

  try {
    const url =
      `${config.strapi.url}/api/posts` +
      `?status=draft` +
      `&populate[coverImage][populate]=formats` +
      `&populate[category][fields][0]=id&populate[category][fields][1]=name` +
      `&sort[0]=updatedAt:desc` +
      `&pagination[pageSize]=100`;

    const res = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${strapiToken}`,
      },
      cache: 'no-store',
    });

    const data = await res.json();
    if (!res.ok) {
      return NextResponse.json(
        { error: data?.error?.message ?? `Strapi error ${res.status}` },
        { status: res.status },
      );
    }

    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Unknown error' },
      { status: 500 },
    );
  }
}

// ─── POST /api/admin/posts ────────────────────────────────────────────────────
// Creates a new post. Body is the raw `data` payload (Strapi's wrapper is
// added here).
export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const strapiToken = session.user.strapiToken ?? config.strapi.apiToken;

  try {
    const body = await request.json();

    const res = await fetch(`${config.strapi.url}/api/posts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${strapiToken}`,
      },
      body: JSON.stringify({ data: body }),
    });

    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json(
        { error: data?.error?.message ?? `Strapi error ${res.status}` },
        { status: res.status },
      );
    }

    return NextResponse.json(data, { status: 201 });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Unknown error' },
      { status: 500 },
    );
  }
}
