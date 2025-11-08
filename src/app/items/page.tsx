// src/app/items/page.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

type Item = {
  id: number;
  title: string;
  description: string;
  category: string;
  imageUrl: string | null;
  price: number | null;
  status: string;
  isActive: boolean;
  user?: { name: string }; // já vem do include da sua API
};

export default function ItemsPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<string>("todas");
  const [onlyActive, setOnlyActive] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/items", { cache: "no-store" })
      .then((r) => r.json())
      .then((data) => setItems(Array.isArray(data) ? data : []))
      .finally(() => setLoading(false));
  }, []);

  const categories = useMemo(() => {
    const set = new Set(items.map((i) => i.category).filter(Boolean));
    return ["todas", ...Array.from(set)];
  }, [items]);

  const filtered = useMemo(() => {
    return items.filter((i) => {
      if (onlyActive && !i.isActive) return false;
      if (cat !== "todas" && i.category !== cat) return false;
      if (q) {
        const hay = (i.title + " " + i.description).toLowerCase();
        if (!hay.includes(q.toLowerCase())) return false;
      }
      return true;
    });
  }, [items, q, cat, onlyActive]);

  return (
    <div style={{ maxWidth: 1000, margin: "0 auto", padding: 16 }}>
      <h1 style={{ marginBottom: 12 }}>Produtos cadastrados</h1>

      {/* Filtros */}
      <div style={{
        display: "grid", gridTemplateColumns: "1fr 200px 160px", gap: 8,
        background: "#fff", border: "1px solid #eee", borderRadius: 10, padding: 12, marginBottom: 16
      }}>
        <input
          placeholder="Buscar por título ou descrição…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          style={{ padding: 10, border: "1px solid #ccc", borderRadius: 8 }}
          aria-label="Buscar"
        />
        <select
          value={cat}
          onChange={(e) => setCat(e.target.value)}
          style={{ padding: 10, border: "1px solid #ccc", borderRadius: 8 }}
          aria-label="Categoria"
        >
          {categories.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <label style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <input type="checkbox" checked={onlyActive} onChange={(e) => setOnlyActive(e.target.checked)} />
          Somente ativos
        </label>
      </div>

      <Link
        href="/items/new"
        style={{
          display: "inline-block", marginBottom: 12, padding: "8px 14px",
          backgroundColor: "var(--reuse-green)", color: "#fff", borderRadius: 8, textDecoration: "none"
        }}
      >
        + Novo Produto
      </Link>

      {loading ? (
        <p>Carregando…</p>
      ) : filtered.length === 0 ? (
        <p>Nenhum produto encontrado.</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0, display: "grid", gap: 12, gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))" }}>
          {filtered.map((item) => (
            <li key={item.id} style={{ border: "1px solid #eee", borderRadius: 10, background: "#fff", overflow: "hidden" }}>
              <img
                src={item.imageUrl || "https://via.placeholder.com/400x260?text=Item"}
                alt={item.title}
                style={{ width: "100%", height: 160, objectFit: "cover" }}
              />
              <div style={{ padding: 12 }}>
                <h3 style={{ marginBottom: 6 }}>{item.title}</h3>
                <p style={{ color: "var(--reuse-text)", fontSize: ".95rem", minHeight: 44 }}>
                  {item.description.length > 80 ? item.description.slice(0, 80) + "…" : item.description}
                </p>
                <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap", marginTop: 6 }}>
                  <span style={{ background: "var(--reuse-light)", border: "1px solid #e5e5e5", padding: "2px 8px", borderRadius: 999 }}>
                    {item.category}
                  </span>
                  {item.price != null && <strong>R$ {item.price.toFixed(2)}</strong>}
                  <span style={{ marginLeft: "auto", color: item.isActive ? "var(--reuse-green)" : "var(--reuse-accent)", fontWeight: 700 }}>
                    {item.isActive ? "Disponível" : "Indisponível"}
                  </span>
                </div>

                <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
                  <Link href={`/items/${item.id}`} style={{ color: "#2082DE" }}>
                    Ver detalhes
                  </Link>
                  {!!item.user?.name && (
                    <span style={{ marginLeft: "auto", fontSize: ".85rem", opacity: .8 }}>
                      por {item.user.name}
                    </span>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
