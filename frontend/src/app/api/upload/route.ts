import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { config } from '@/lib/config';

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const strapiToken = session.user.strapiToken ?? config.strapi.apiToken;

  try {
    const formData = await request.formData();

    const res = await fetch(`${config.strapi.url}/api/upload`, {
      method:  'POST',
      headers: { 'Authorization': `Bearer ${strapiToken}` },
      body:    formData,
    });

    if (!res.ok) {
      const error = await res.text();
      return NextResponse.json(
        { error: `Strapi upload failed: ${res.status}`, detail: error },
        { status: res.status }
      );
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Upload failed' },
      { status: 500 }
    );
  }
}
