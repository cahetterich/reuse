'use client';
import useSWR from 'swr';
import React from 'react';
import Link from 'next/link';

type Promo = {
  enabled: boolean;
  type: 'percent' | 'freeship';
  percent: number;
  freeShippingMin: number;
  message: string;
  updatedAt?: string | null;
};

const fetcher = (u: string) => fetch(u).then(r => r.json());
const toBRL = (n: number) =>
  n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 });

const promoKey = (p: Promo | undefined) =>
  `promo-v2:${!!p?.enabled}:${p?.type ?? ''}:${p?.percent ?? 0}:${p?.freeShippingMin ?? 0}:${(p?.message ?? '').trim()}`;

export default function PromoBannerPro() {
  const { data } = useSWR<Promo>('/api/content/promo', fetcher, { revalidateOnFocus: false });

  const [closed, setClosed] = React.useState(false);
  const key = React.useMemo(() => promoKey(data), [data]);

  React.useEffect(() => {
    if (!data) return;
    try { setClosed(localStorage.getItem(key) === '1'); } catch {}
  }, [data, key]);

  if (!data || !data.enabled || closed) return null;

  const headline =
    data.type === 'percent'
      ? `${data.percent}% de desconto na 1ª compra`
      : `Frete grátis acima de ${toBRL(data.freeShippingMin)}`;

  const sub = (data.message && data.message.trim())
    || (data.type === 'percent'
          ? 'Válido para novos cadastros por tempo limitado.'
          : 'Oferta por tempo limitado para a sua região.');

  // —— estilos
  const wrap: React.CSSProperties = { margin: '18px auto 8px', maxWidth: 1100, padding: 0 };

  const card: React.CSSProperties = {
    position: 'relative',
    display: 'grid',
    gridTemplateColumns: 'auto 1fr auto',
    gap: 16,
    alignItems: 'center',
    padding: '16px 18px',
    borderRadius: 16,
    border: '1px solid #a7f3d0',
    background: 'linear-gradient(100deg,#ecfdf5 0%,#e6fffa 55%,#f0fff7 100%)',
    color: '#064e3b',
    boxShadow: '0 6px 20px rgba(6,78,59,0.10)',
  };

  const icon: React.CSSProperties = {
    width: 44, height: 44, borderRadius: 12,
    display: 'grid', placeItems: 'center',
    background: '#d1fae5', border: '1px solid #a7f3d0',
    fontSize: 22,
  };

  const title: React.CSSProperties = {
    margin: 0, fontSize: 18, fontWeight: 800, letterSpacing: .2,
  };

  const subline: React.CSSProperties = {
    margin: '2px 0 0', fontSize: 13.5, color: '#065f46',
  };

  const cta: React.CSSProperties = {
    whiteSpace: 'nowrap',
    padding: '12px 14px',
    borderRadius: 12,
    background: '#065f46',
    color: '#fff',
    fontWeight: 700,
    textDecoration: 'none',
    border: '2px solid #064e3b',
    boxShadow: '0 2px 0 #064e3b',
  };

  const close: React.CSSProperties = {
    position: 'absolute', right: 10, top: 10,
    width: 34, height: 34, borderRadius: 10,
    border: '1px solid #a7f3d0', background: '#ffffffbf',
    color: '#065f46', fontWeight: 800 as any, cursor: 'pointer',
  };

  const onClose = () => { try { localStorage.setItem(key, '1'); } catch {} ; setClosed(true); };

  return (
    <div style={wrap} role="region" aria-label="Promoção vigente">
      <div style={card}>
        <div style={icon} aria-hidden>🎁</div>

        <div style={{ minWidth: 0 }}>
          <h3 style={title}>{headline}</h3>
          <p style={subline}>{sub}</p>
        </div>

        <div>
          <Link href="/register" style={cta} aria-label="Aproveitar a promoção agora">
            Quero aproveitar
          </Link>
        </div>

        <button aria-label="Fechar banner" style={close} onClick={onClose} title="Fechar">×</button>
      </div>
    </div>
  );
}
