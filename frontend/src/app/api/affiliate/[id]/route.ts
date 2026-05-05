import { NextResponse } from 'next/server';
import { fetchStrapi, trackAffiliateClick } from '@/lib/api';
import { StrapiSingleResponse, Product, StrapiItem } from '@/types';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const productId = parseInt(id, 10);

  if (!productId) {
    return NextResponse.json({ error: 'Invalid product ID' }, { status: 400 });
  }

  // Fetch product for its affiliateUrl
  const product = await fetchStrapi<StrapiSingleResponse<StrapiItem<Product>>>(
    `/products/${productId}`,
    { noCache: true }
  );
  const affiliateUrl = product?.data?.affiliateUrl;

  if (!affiliateUrl) {
    return NextResponse.json({ error: 'Product not found' }, { status: 404 });
  }

  // Extract context from request
  const referer = request.headers.get('referer') || '';
  const userAgent = request.headers.get('user-agent') || '';
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || '';
  const postId = new URL(request.url).searchParams.get('postId');

  // Track click (fire-and-forget — don't block redirect)
  trackAffiliateClick({
    productId,
    ...(postId ? { postId: parseInt(postId, 10) } : {}),
    url: affiliateUrl,
  }).catch(() => {}); // never let tracking failure block redirect

  return NextResponse.redirect(affiliateUrl, { status: 302 });
}
