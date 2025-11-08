'use client';
import useSWR from 'swr';
import React from 'react';

type Flags = Record<string, { value: boolean; params?: any }>;
const fetcher = (u: string) => fetch(u).then(r => r.json());

export default function TradesBadge({ style }: { style?: React.CSSProperties }) {
  const { data } = useSWR<Flags>('/api/config/flags', fetcher, { revalidateOnFocus: false });
  const on = !!data?.['trades.enabled']?.value;
  if (!on) return null;

  const pill: React.CSSProperties = {
    display: 'inline-flex', alignItems: 'center', gap: 6,
    background: '#d1fae5', border: '1px solid #10b981', color: '#065f46',
    fontSize: 11.5, fontWeight: 700, letterSpacing: .3,
    borderRadius: 999, padding: '4px 8px',
    boxShadow: '0 1px 0 rgba(0,0,0,0.07)',
  };

  return (
    <span style={{ ...pill, ...style }} aria-label="Trocas habilitadas">
      <span aria-hidden>🔁</span> Trocas ativas
    </span>
  );
}
