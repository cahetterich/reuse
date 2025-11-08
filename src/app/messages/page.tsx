"use client";

import { useEffect, useMemo, useState } from "react";

type Message = { id: string; from: string; to: string; text: string; ts: number };
type Thread = { peer: string; last: number };

const seedIfEmpty = () => {
  const raw = localStorage.getItem("reuse_messages");
  if (!raw) {
    const now = Date.now();
    const demo: Message[] = [
      { id: "1", from: "maria@reuse.com", to: "me", text: "Oi! A câmera ainda está disponível?", ts: now - 1000 * 60 * 60 },
      { id: "2", from: "me", to: "maria@reuse.com", text: "Está sim! Posso reservar pra você.", ts: now - 1000 * 60 * 30 },
    ];
    localStorage.setItem("reuse_messages", JSON.stringify(demo));
  }
};

export default function MessagesPage() {
  const [me, setMe] = useState<string>("me");
  const [messages, setMessages] = useState<Message[]>([]);
  const [peer, setPeer] = useState<string>("maria@reuse.com");
  const [draft, setDraft] = useState("");

  useEffect(() => {
    seedIfEmpty();
    const raw = localStorage.getItem("reuse_messages");
    setMessages(raw ? JSON.parse(raw) : []);
    const u = localStorage.getItem("user");
    if (u) {
      try { setMe(JSON.parse(u).email || "me"); } catch {}
    }
  }, []);

  const threads = useMemo<Thread[]>(() => {
    const map = new Map<string, number>();
    for (const m of messages) {
      const other = m.from === me ? m.to : m.from;
      map.set(other, Math.max(map.get(other) || 0, m.ts));
    }
    return [...map.entries()].map(([peer, last]) => ({ peer, last })).sort((a,b) => b.last - a.last);
  }, [messages, me]);

  const threadMsgs = messages.filter(m => m.from === peer || m.to === peer).sort((a,b) => a.ts - b.ts);

  const send = () => {
    const text = draft.trim();
    if (!text) return;
    const msg: Message = { id: crypto.randomUUID(), from: me, to: peer, text, ts: Date.now() };
    const next = [...messages, msg];
    setMessages(next);
    localStorage.setItem("reuse_messages", JSON.stringify(next));
    setDraft("");
  };

  return (
    <div style={{ display: "grid", gridTemplateColumns: "280px 1fr", minHeight: "70vh" }}>
      <aside style={{ borderRight: "1px solid #eee", background: "#fff" }}>
        <div style={{ padding: 12, borderBottom: "1px solid #eee", fontWeight: 700 }}>Conversas</div>
        <div>
          {threads.map(t => (
            <button
              key={t.peer}
              onClick={() => setPeer(t.peer)}
              style={{
                width: "100%", textAlign: "left", padding: 12, border: "none",
                background: peer === t.peer ? "#eef6ff" : "transparent", cursor: "pointer"
              }}
            >
              {t.peer}
            </button>
          ))}
        </div>
      </aside>

      <section style={{ display: "flex", flexDirection: "column" }}>
        <div style={{ padding: 12, borderBottom: "1px solid #eee", background: "#fff" }}>
          <strong>Chat com {peer}</strong>
        </div>
        <div style={{ flex: 1, padding: 16, display: "grid", gap: 8, background: "var(--reuse-light)" }}>
          {threadMsgs.map(m => (
            <div key={m.id} style={{
              justifySelf: m.from === me ? "end" : "start",
              background: m.from === me ? "var(--reuse-green)" : "#fff",
              color: m.from === me ? "#fff" : "inherit",
              padding: "8px 12px", borderRadius: 12, maxWidth: 520
            }}>
              {m.text}
            </div>
          ))}
        </div>
        <div style={{ padding: 12, display: "flex", gap: 8, background: "#fff", borderTop: "1px solid #eee" }}>
          <input
            value={draft} onChange={e => setDraft(e.target.value)}
            placeholder="Escreva uma mensagem"
            style={{ flex: 1, padding: 10, border: "1px solid #ccc", borderRadius: 8 }}
          />
          <button onClick={send} className="btn-primary">Enviar</button>
        </div>
      </section>
    </div>
  );
}
