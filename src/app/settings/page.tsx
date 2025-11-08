// src/app/settings/page.tsx
"use client";

import { useEffect, useState } from "react";

export default function SettingsPage() {
  const [dark, setDark] = useState(false);
  const [alerts, setAlerts] = useState(true);

  useEffect(() => {
    const s = localStorage.getItem("reuse_prefs");
    if (s) {
      try {
        const prefs = JSON.parse(s);
        setDark(!!prefs.dark); setAlerts(prefs.alerts ?? true);
      } catch {}
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("reuse_prefs", JSON.stringify({ dark, alerts }));
  }, [dark, alerts]);

  return (
    <div style={{ maxWidth: 640, margin: "0 auto", padding: 16, background: "#fff", borderRadius: 12, border: "1px solid #eee" }}>
      <h1>Configurações</h1>
      <label style={{ display: "flex", gap: 8, alignItems: "center", marginTop: 12 }}>
        <input type="checkbox" checked={dark} onChange={() => setDark(s => !s)} />
        Tema escuro (demo)
      </label>
      <label style={{ display: "flex", gap: 8, alignItems: "center", marginTop: 8 }}>
        <input type="checkbox" checked={alerts} onChange={() => setAlerts(s => !s)} />
        Receber alertas (local)
      </label>
      <p style={{ marginTop: 12, color: "var(--reuse-text)" }}>
        Preferências salvas apenas neste navegador para efeito de demonstração.
      </p>
    </div>
  );
}

