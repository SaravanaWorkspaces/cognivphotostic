import { NextResponse } from 'next/server';
import { getCategories } from '@/lib/api';

export async function GET() {
  try {
    const data = await getCategories();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ data: [] }, { status: 200 });
  }
}
