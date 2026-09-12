import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get('url');

  if (!url || !url.startsWith('http')) {
    return new NextResponse('URL tidak valid', { status: 400 });
  }

  try {
    const res = await fetch(url);
    const blob = await res.blob();
    
    const headers = new Headers();
    headers.set('Content-Type', res.headers.get('Content-Type') || 'image/jpeg');
    // Cache the image heavily on Vercel CDN so we don't fetch from ImgBB repeatedly
    headers.set('Cache-Control', 'public, s-maxage=31536000, stale-while-revalidate=86400');
    
    return new NextResponse(blob, {
      status: 200,
      headers,
    });
  } catch (error) {
    console.error("Proxy Error:", error);
    return new NextResponse('Gagal memuat gambar dari server', { status: 500 });
  }
}
