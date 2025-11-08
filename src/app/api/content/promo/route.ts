//src/app/api/content/promo/route.ts
import { NextResponse } from 'next/server';

export async function GET() {
  const base = process.env.NEXT_PUBLIC_ADMIN_BASE!;
  const r = await fetch(`${base}/content/promo`, { cache: 'no-store' });
  const data = await r.json();
  return NextResponse.json(data);
}
