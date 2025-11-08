// src/app/items/my/page.tsx

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FaEdit, FaTrash } from "react-icons/fa";
import styles from "./myItems.module.css";

interface User {
  id: number;
  name: string;
  email: string;
}

interface Item {
  id: number;
  title: string;
  description: string;
  category: string;
  price: number | null;
  imageUrl: string | null;
  status: string;       // "disponível" | "reservado" | "trocado"
  isActive: boolean;
}

export default function MyItemsPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (!stored) {
      router.push("/login");
      return;
    }
    const u = JSON.parse(stored) as User;
    setUser(u);

    fetch(`/api/items?userId=${u.id}`, { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => setItems(data))
      .catch((err) => console.error("Erro ao carregar itens:", err))
      .finally(() => setLoading(false));
  }, [router]);

  const handleToggle = async (id: number, current: boolean) => {
  try {
    const res = await fetch(`/api/items/${id}/toggle`, { method: "PUT" });
    if (!res.ok) throw new Error("Falha ao alternar status");

    const updated = await res.json();
    setItems((prev) =>
      prev.map((it) => (it.id === id ? { ...it, ...updated } : it))
    );
  } catch (e) {
    alert("Não foi possível atualizar o status. Tente novamente.");
  }
};


  const handleDelete = async (id: number) => {
    const ok = confirm("Tem certeza que deseja excluir este item?");
    if (!ok) return;
    try {
      const res = await fetch(`/api/items/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Falha ao excluir");
      setItems((prev) => prev.filter((it) => it.id !== id));
    } catch (e) {
      alert("Não foi possível excluir. Tente novamente.");
    }
  };

  return (
    <>
      <div className={styles.header}>
        <h1 className="pageTitle">Meus Itens</h1>
        <button
          className={styles.addBtn}
          onClick={() => router.push("/items/new")}
        >
          + Adicionar item
        </button>
      </div>

      {loading ? (
        <p>Carregando...</p>
      ) : items.length === 0 ? (
        <div className={styles.tableWrap}>
          <div style={{ padding: 16 }}>
            <p>Você ainda não cadastrou itens.</p>
            <button
              className={styles.addBtn}
              style={{ marginTop: 12 }}
              onClick={() => router.push("/items/new")}
            >
              Cadastrar primeiro item
            </button>
          </div>
        </div>
      ) : (
        <>
         
          <div className={`${styles.mobileOnly} ${styles.mobileList}`}>
            {items.map((item) => (
              <div key={item.id} className={styles.mobileCard}>
                <div className={styles.mobileHeader}>
                  <img
                    className={styles.mobileThumb}
                    src={item.imageUrl || "https://via.placeholder.com/300x200?text=Item"}
                    alt={item.title}
                  />
                  <div className={styles.mobileInfo}>
                    <div className={styles.mobileTitleRow}>
                      <span className={styles.mobileTitle}>{item.title}</span>
                      <span
                        className={`${styles.mobileStatus} ${
                          item.status === "disponível"
                            ? styles.statusAvailable
                            : styles.statusTraded
                        }`}
                      >
                        {item.status}
                      </span>
                    </div>
                    <div className={styles.mobileMeta}>
                      <span className={styles.badge}>{item.category}</span>
                      <span className={styles.price}>
                        {item.price != null ? `R$ ${item.price.toFixed(2)}` : "—"}
                      </span>
                    </div>
                  </div>
                </div>

                <p className={styles.mobileDesc}>{item.description}</p>

                <div className={styles.mobileActions}>
                  <label className={styles.switch} title="Ativo/Inativo">
                    <input
                      type="checkbox"
                      checked={item.isActive}
                      onChange={() => handleToggle(item.id, item.isActive)}
                      aria-label={`Marcar ${item.title} como ${item.isActive ? "inativo" : "ativo"}`}
                    />
                    <span className={styles.slider} />
                  </label>

                  <div>
                    <button
                      className={styles.editBtn}
                      onClick={() => router.push(`/items/${item.id}/edit`)}
                    >
                      <FaEdit size={14} /> Editar
                    </button>
                    <button
                      className={styles.deleteBtn}
                      onClick={() => handleDelete(item.id)}
                    >
                      <FaTrash size={14} /> Excluir
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </>
  );
}
