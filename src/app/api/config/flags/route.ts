// app/api/config/flags/route.ts
export async function GET() {
  const base = process.env.NEXT_PUBLIC_ADMIN_BASE!;
  const res = await fetch(`${base}/config/flags`, { cache: 'no-store' });

  // Se o Node-RED cair, devolve objeto vazio p/ não quebrar o site
  if (!res.ok) {
    return Response.json({}, { status: 200 });
  }

  const flags = await res.json();
  return Response.json(flags, { status: 200 });
}
