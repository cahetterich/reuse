'use client';
import useSWR from 'swr';
import React from 'react';

type Promo = {
  enabled: boolean;
  type: 'percent' | 'freeship';
  percent: number;
  freeShippingMin: number;
  message: string;
};

const fetcher = (url: string) => fetch(url).then(r => r.json());

export default function PromoRibbon() {
  const { data } = useSWR<Promo>('/api/content/promo', fetcher, {
    revalidateOnFocus: false,
  });

  if (!data || !data.enabled) return null;

  const style: React.CSSProperties = {
    margin: '16px auto',
    maxWidth: 980,
    padding: '10px 14px',
    borderRadius: 8,
    border: '1px solid #d5f1dd',
    background: '#f1fff5',
    color: '#245a36',
    fontSize: 14,
    lineHeight: 1.4,
  };

  const text = data.message?.trim()
    || (data.type === 'percent'
        ? `🎉 ${data.percent}% de desconto na primeira compra!`
        : `🚚 Frete grátis em compras acima de R$ ${data.freeShippingMin}`);

  return <div style={style} role="status" aria-live="polite">{text}</div>;
}
