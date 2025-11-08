"use client";

import { useEffect, useState } from "react";

type Flags = Record<string, boolean | string | number>;

export default function AlertsPage() {
  const [flags, setFlags] = useState<Flags>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const r = await fetch("/api/config/flags", { cache: "no-store" });
        const data = await r.json();
        if (mounted) setFlags(data || {});
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  if (loading) return <p style={{ padding: 16 }}>Carregando...</p>;

  const entries = Object.entries(flags);

  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: 16 }}>
      <h1>Alertas & Flags</h1>
      {entries.length === 0 ? (
        <p style={{ marginTop: 12 }}>Sem alertas no momento.</p>
      ) : (
        <div style={{ display: "grid", gap: 12 }}>
          {entries.map(([key, val]) => (
            <div key={key} style={{ background: "#fff", border: "1px solid #eee", borderRadius: 12, padding: 16 }}>
              <strong>{key}</strong>
              <div style={{ marginTop: 6, color: "var(--reuse-text)" }}>
                {typeof val === "boolean" ? (val ? "Ativo" : "Inativo") : String(val)}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
