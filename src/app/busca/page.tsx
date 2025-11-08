// src/app/busca/page.tsx

"use client";

import { useEffect, useMemo, useState } from "react";
import styles from "./page.module.css";
import Modal from "@/app/components/Modal";
import { useCart } from "@/app/components/cart/CartContext";

type Item = {
  id: number;
  title: string;
  description: string;
  category: string;
  price: number | null;
  imageUrl: string | null;
  status: string;       // "disponível" | "reservado" | "trocado" | "indisponível"
  isActive: boolean;
  userId: number;
  user?: { name: string };
};

const CATEGORIES = ["Todos", "Eletrônicos", "Roupas", "Livros", "Móveis", "Outros"] as const;
type CategoryFilter = typeof CATEGORIES[number];
type SortKey = "recentes" | "precoAsc" | "precoDesc" | "titulo";
type Action = "buy" | "trade" | "message" | null;

export default function BuscarItensPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<CategoryFilter>("Todos");
  const [sort, setSort] = useState<SortKey>("recentes");
  const [onlyActive, setOnlyActive] = useState(true);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [me, setMe] = useState<{ id: number; name: string; email: string } | null>(null);

  // modal
  const [modalOpen, setModalOpen] = useState(false);
  const [action, setAction] = useState<Action>(null);
  const [currentItem, setCurrentItem] = useState<Item | null>(null);

  // carrinho
  const { add } = useCart();

  // carrega usuário "logado" (modelo atual)
  useEffect(() => {
    const raw = localStorage.getItem("user");
    if (raw) setMe(JSON.parse(raw));
  }, []);

  // carrega itens
  useEffect(() => {
    fetch("/api/items", { cache: "no-store" })
      .then((r) => r.json())
      .then((data: Item[]) => setItems(data))
      .catch(() => setItems([]));
  }, []);

  // favoritos
  useEffect(() => {
    const raw = localStorage.getItem("favorites");
    if (raw) setFavorites(JSON.parse(raw));
  }, []);
  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

  const toggleFav = (id: number) =>
    setFavorites((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

  // filtra: exclui itens do próprio usuário
  const filtered = useMemo(() => {
    const mineId = me?.id;
    let out = items.filter((it) => (mineId ? it.userId !== mineId : true));

    if (onlyActive) out = out.filter((it) => it.isActive && it.status !== "trocado" && it.status !== "indisponível");
    if (cat !== "Todos") out = out.filter((it) => it.category === cat);
    if (q.trim()) {
      const term = q.toLowerCase();
      out = out.filter(
        (it) =>
          it.title.toLowerCase().includes(term) ||
          it.description.toLowerCase().includes(term) ||
          it.category.toLowerCase().includes(term)
      );
    }

    out = [...out].sort((a, b) => {
      if (sort === "precoAsc") return (a.price ?? Infinity) - (b.price ?? Infinity);
      if (sort === "precoDesc") return (b.price ?? -Infinity) - (a.price ?? -Infinity);
      if (sort === "titulo") return a.title.localeCompare(b.title, "pt-BR");
      return 0;
    });

    return out;
  }, [items, me, onlyActive, cat, q, sort]);

  const formatPrice = (v: number | null) =>
    v == null ? "—" : v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  // ===== Handlers de ação: abrem o modal =====
  const openAction = (a: Action, item: Item) => {
    setCurrentItem(item);
    setAction(a);
    setModalOpen(true);
  };

  return (
    <div className={styles.wrap}>
      <h1 className="pageTitle">Buscar Itens</h1>

      {/* Filtros */}
      <div className={styles.filters} role="search">
        <input
          className={styles.input}
          placeholder="Buscar por título ou descrição..."
          aria-label="Buscar por título ou descrição"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />

        <select
          className={styles.select}
          aria-label="Filtrar por categoria"
          value={cat}
          onChange={(e) => setCat(e.target.value as CategoryFilter)}
        >
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>

        <select
          className={styles.select}
          aria-label="Ordenar"
          value={sort}
          onChange={(e) => setSort(e.target.value as SortKey)}
        >
          <option value="recentes">Mais recentes</option>
          <option value="precoAsc">Preço: menor → maior</option>
          <option value="precoDesc">Preço: maior → menor</option>
          <option value="titulo">Título (A→Z)</option>
        </select>

        <label className={styles.onlyActive}>
          <input type="checkbox" checked={onlyActive} onChange={(e) => setOnlyActive(e.target.checked)} />
          Somente ativos
        </label>
      </div>

      {/* Grid de cards */}
      <section className={styles.grid} aria-live="polite">
        {filtered.map((it) => (
          <article key={it.id} className={styles.card} aria-label={`Item ${it.title}`}>
            <div className={styles.mediaWrap}>
              <img
                src={it.imageUrl || "https://via.placeholder.com/640x420?text=Item"}
                alt={it.title}
                className={styles.media}
                loading="lazy"
              />
              <button
                className={`${styles.pill} ${favorites.includes(it.id) ? styles.pillOn : ""}`}
                onClick={() => toggleFav(it.id)}
                aria-pressed={favorites.includes(it.id)}
                aria-label={favorites.includes(it.id) ? "Remover dos salvos" : "Salvar item"}
              >
                {favorites.includes(it.id) ? "Salvo" : "Salvar"}
              </button>
            </div>

            <div className={styles.body}>
              <div className={styles.rowTop}>
                <h3 className={styles.cardTitle}>{it.title}</h3>
                <span className={`${styles.badge} ${
                  it.isActive && it.status !== "trocado" && it.status !== "indisponível"
                    ? styles.badgeOk : styles.badgeWarn
                }`}>
                  {it.isActive ? "Disponível" : "Indisponível"}
                </span>
              </div>

              <p className={styles.desc} title={it.description}>{it.description}</p>

              <div className={styles.rowMeta}>
                <span className={styles.chip}>{it.category}</span>
                <strong className={styles.price}>{formatPrice(it.price)}</strong>
              </div>
            </div>

            <div className={styles.actions}>
              <button className={styles.btnPrimary} onClick={() => openAction("buy", it)} aria-label={`Comprar ${it.title}`}>
                Comprar
              </button>
              <button className={styles.btnGhost} onClick={() => openAction("trade", it)} aria-label={`Trocar ${it.title}`}>
                Trocar
              </button>
              <button className={styles.btnGhost} onClick={() => openAction("message", it)} aria-label={`Enviar mensagem sobre ${it.title}`}>
                Enviar mensagem
              </button>
            </div>
          </article>
        ))}
      </section>

      {filtered.length === 0 && <p className={styles.empty}>Nenhum item encontrado com os filtros atuais.</p>}

      {/* ===== Modal ===== */}
      <Modal
        open={modalOpen}
        title={
          action === "buy" ? "Comprar item" :
          action === "trade" ? "Propor troca" : "Enviar mensagem"
        }
        onClose={() => setModalOpen(false)}
      >
        {action === "buy" && (
          <form>
            <p>
              Confirmar compra de <strong>{currentItem?.title}</strong>
              {currentItem?.price != null && <> por <strong>{formatPrice(currentItem.price)}</strong></>}?
            </p>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap: 12, marginTop: 12 }}>
              <button
                data-autofocus
                className="btn-primary"
                onClick={(e) => {
                  e.preventDefault();
                  if (currentItem) {
                    add({
                      id: currentItem.id,
                      title: currentItem.title,
                      price: currentItem.price ?? 0,
                      imageUrl: currentItem.imageUrl ?? null
                    });
                  }
                  setModalOpen(false);
                }}
              >
                Adicionar ao carrinho
              </button>
              <button className="btn-secondary" type="button" onClick={() => setModalOpen(false)}>
                Cancelar
              </button>
            </div>
          </form>
        )}

        {action === "trade" && (
          <form>
            <label style={{ display:"block", marginBottom: 6 }}>Mensagem para a troca</label>
            <textarea rows={5} style={{ width:"100%" }} placeholder="Descreva o item que oferece em troca" data-autofocus />
            <div style={{ display:"flex", gap: 12, marginTop: 8 }}>
              <button className="btn-primary">Enviar proposta</button>
              <button className="btn-secondary" type="button" onClick={() => setModalOpen(false)}>Cancelar</button>
            </div>
          </form>
        )}

        {action === "message" && (
          <form>
            <label style={{ display:"block", marginBottom: 6 }}>Sua mensagem</label>
            <textarea rows={5} style={{ width:"100%" }} placeholder="Escreva para o vendedor" data-autofocus />
            <div style={{ display:"flex", gap: 12, marginTop: 8 }}>
              <button className="btn-primary">Enviar</button>
              <button className="btn-secondary" type="button" onClick={() => setModalOpen(false)}>Cancelar</button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
}
