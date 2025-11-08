// src/app/items/[id]/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import styles from "./itemDetails.module.css";

type Item = {
  id: number;
  title: string;
  description: string;
  category: string;
  imageUrl: string | null;
  price: number | null;
  status: string; // "disponível" | "indisponível" | "reservado" | "trocado"
  isActive: boolean;
  userId: number;
};

export default function ItemDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [item, setItem] = useState<Item | null>(null);
  const [loading, setLoading] = useState(true);

  const currentUserId = (() => {
    try {
      const u = localStorage.getItem("user");
      return u ? (JSON.parse(u).id as number) : null;
    } catch {
      return null;
    }
  })();

  useEffect(() => {
    if (!id) return;
    // fetch relativo → funciona no dev e no deploy
    fetch(`/api/items/${id}`, { cache: "no-store" })
      .then((r) => r.json())
      .then((data) => setItem(data.error ? null : data))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className={styles.wrap}><p>Carregando…</p></div>;
  if (!item) return <div className={styles.wrap}><p>Item não encontrado.</p></div>;

  const isOwner = currentUserId === item.userId;
  const price = item.price != null ? `R$ ${item.price.toFixed(2)}` : "—";
  const waMsg = encodeURIComponent(
    `Olá! Tenho interesse no item "${item.title}" que vi na ReUse. Ainda está disponível?`
  );
  const waLink = `https://wa.me/?text=${waMsg}`;

  return (
    <div className={styles.wrap}>
      <div className={styles.card}>
        <div className={styles.mediaCol}>
          <img
            className={styles.image}
            src={item.imageUrl || "https://via.placeholder.com/600x400?text=Item"}
            alt={item.title}
          />
        </div>

        <div className={styles.infoCol}>
          <h1 className={styles.title}>{item.title}</h1>

          <div className={styles.meta}>
            <span className={styles.badge}>{item.category}</span>
            <span className={item.isActive ? styles.statusOk : styles.statusKo}>
              {item.isActive ? "disponível" : "indisponível"}
            </span>
            <span className={styles.price}>{price}</span>
          </div>

          <p className={styles.desc}>{item.description}</p>

          <div className={styles.actions}>
            <a className={styles.primaryBtn} href={waLink} target="_blank" rel="noreferrer">
              Quero trocar
            </a>

            {isOwner && (
              <>
                <Link className={styles.secondaryBtn} href={`/items/${item.id}/edit`}>
                  Editar
                </Link>
                <button
                  className={styles.linkBtn}
                  onClick={() => router.push("/dashboard")}
                  aria-label="Voltar ao dashboard"
                >
                  Voltar ao dashboard
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      <div className={styles.footerLinks}>
        <Link href="/items" className={styles.linkBtn}>Voltar ao catálogo</Link>
      </div>
    </div>
  );
}
