import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { config } from '@/lib/config';

// All handlers operate on Strapi 5's `documentId` (string), not numeric id.

async function requireSession() {
  const session = await auth();
  if (!session?.user) return null;
  return session;
}

// ─── GET /api/admin/posts/[id] ────────────────────────────────────────────────
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await requireSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;
  const strapiToken = session.user.strapiToken ?? config.strapi.apiToken;

  try {
    const res = await fetch(
      `${config.strapi.url}/api/posts/${encodeURIComponent(id)}?status=draft&populate=*`,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${strapiToken}`,
        },
        cache: 'no-store',
      },
    );

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

// ─── PUT /api/admin/posts/[id] ────────────────────────────────────────────────
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await requireSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;
  const strapiToken = session.user.strapiToken ?? config.strapi.apiToken;

  try {
    const body = await request.json();

    const res = await fetch(
      `${config.strapi.url}/api/posts/${encodeURIComponent(id)}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${strapiToken}`,
        },
        body: JSON.stringify({ data: body }),
      },
    );

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

// ─── DELETE /api/admin/posts/[id] ─────────────────────────────────────────────
export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await requireSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;
  const strapiToken = session.user.strapiToken ?? config.strapi.apiToken;

  try {
    const res = await fetch(
      `${config.strapi.url}/api/posts/${encodeURIComponent(id)}`,
      {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${strapiToken}`,
        },
      },
    );

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      return NextResponse.json(
        { error: data?.error?.message ?? `Strapi error ${res.status}` },
        { status: res.status },
      );
    }

    return new NextResponse(null, { status: 204 });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Unknown error' },
      { status: 500 },
    );
  }
}
