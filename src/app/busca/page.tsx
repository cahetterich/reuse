// src/app/busca/page.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import styles from "./page.module.css";
import Modal from "../components/Modal";        // <= ajuste o caminho se seu Modal estiver em outro lugar
import { addToCart } from "../../lib/cart";        // <= util do carrinho

type Item = {
  id: number;
  title: string;
  description: string;
  category: string;
  price: number | null;
  imageUrl: string | null;
  status: string;
  isActive: boolean;
  userId: number;
  user?: { name: string };
};

const CATEGORIES = ["Todos", "Eletrônicos", "Roupas", "Livros", "Móveis", "Outros"] as const;
type CategoryFilter = typeof CATEGORIES[number];
type SortKey = "recentes" | "precoAsc" | "precoDesc" | "titulo";
type ActionType = "comprar" | "trocar" | "mensagem" | null;

export default function BuscarItensPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<CategoryFilter>("Todos");
  const [sort, setSort] = useState<SortKey>("recentes");
  const [onlyActive, setOnlyActive] = useState(true);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [me, setMe] = useState<{ id: number; name: string; email: string } | null>(null);

  // modal state
  const [openModal, setOpenModal] = useState(false);
  const [action, setAction] = useState<ActionType>(null);
  const [selected, setSelected] = useState<Item | null>(null);

  useEffect(() => {
    const raw = localStorage.getItem("user");
    if (raw) setMe(JSON.parse(raw));
  }, []);

  useEffect(() => {
    fetch("/api/items", { cache: "no-store" })
      .then((r) => r.json())
      .then((data: Item[]) => setItems(data))
      .catch(() => setItems([]));
  }, []);

  useEffect(() => {
    const raw = localStorage.getItem("favorites");
    if (raw) setFavorites(JSON.parse(raw));
  }, []);
  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

  const toggleFav = (id: number) =>
    setFavorites((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

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

  // abrir modal para uma ação
  const openAction = (type: ActionType, item: Item) => {
    setAction(type);
    setSelected(item);
    setOpenModal(true);
  };

  // confirmar ação dentro do modal
  const confirmAction = () => {
    if (!selected || !action) return;

    if (action === "comprar") {
      addToCart(
        {
          id: selected.id,
          title: selected.title,
          price: selected.price,
          imageUrl: selected.imageUrl,
        },
        1
      );
    }

    // trocar / mensagem podem virar rotas próprias depois
    // por enquanto só fechamos o modal
    setOpenModal(false);
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
            <option key={c} value={c}>
              {c}
            </option>
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
          <input
            type="checkbox"
            checked={onlyActive}
            onChange={(e) => setOnlyActive(e.target.checked)}
          />
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
                <span
                  className={`${styles.badge} ${
                    it.isActive && it.status !== "trocado" && it.status !== "indisponível"
                      ? styles.badgeOk
                      : styles.badgeWarn
                  }`}
                >
                  {it.isActive ? "Disponível" : "Indisponível"}
                </span>
              </div>

              <p className={styles.desc} title={it.description}>
                {it.description}
              </p>

              <div className={styles.rowMeta}>
                <span className={styles.chip}>{it.category}</span>
                <strong className={styles.price}>{formatPrice(it.price)}</strong>
              </div>
            </div>

            <div className={styles.actions}>
              <button
                className={styles.btnPrimary}
                onClick={() => openAction("comprar", it)}
                aria-label={`Comprar ${it.title}`}
              >
                Comprar
              </button>
              <button
                className={styles.btnGhost}
                onClick={() => openAction("trocar", it)}
                aria-label={`Trocar ${it.title}`}
              >
                Trocar
              </button>
              <button
                className={styles.btnGhost}
                onClick={() => openAction("mensagem", it)}
                aria-label={`Enviar mensagem sobre ${it.title}`}
              >
                Enviar mensagem
              </button>
            </div>
          </article>
        ))}
      </section>

      {filtered.length === 0 && (
        <p className={styles.empty}>Nenhum item encontrado com os filtros atuais.</p>
      )}

      {/* Modal de ação */}
      <Modal
        open={openModal}
        onClose={() => setOpenModal(false)}
        title={
          action === "comprar"
            ? "Confirmar compra"
            : action === "trocar"
            ? "Propor troca"
            : action === "mensagem"
            ? "Enviar mensagem"
            : ""
        }
      >
        {selected && (
          <div style={{ display: "grid", gap: 12 }}>
            <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
              <img
                src={selected.imageUrl || "https://via.placeholder.com/100x80?text=Item"}
                alt={selected.title}
                width={80}
                height={64}
                style={{ objectFit: "cover", borderRadius: 8 }}
              />
              <div>
                <strong>{selected.title}</strong>
                <div style={{ color: "var(--reuse-text)" }}>{selected.description}</div>
              </div>
            </div>

            {action === "comprar" && (
              <p>Adicionar este item ao carrinho?</p>
            )}
            {action === "trocar" && (
              <p>Em breve: fluxo para propor troca via mensagem/seleção de item.</p>
            )}
            {action === "mensagem" && (
              <p>Em breve: abrir thread de mensagens com o vendedor.</p>
            )}

            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
              <button className="btn-secondary" onClick={() => setOpenModal(false)}>
                Cancelar
              </button>
              <button className="btn-primary" data-autofocus onClick={confirmAction}>
                Confirmar
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
