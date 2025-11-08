// src/app/items/[id]/edit/page.tsx

"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import styles from "../../new/newItem.module.css"; // aproveitamos os estilos do new
import UserNavbar from "@/app/components/UserNavbar"; // ajuste o caminho se necessário

export default function EditItemPage() {
  const router = useRouter();
  const params = useParams(); // pegamos o id da URL
  const { id } = params;

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Carregar dados do item
  useEffect(() => {
    if (!id) return;

    fetch(`/api/items/${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          setError("Item não encontrado.");
        } else {
          setTitle(data.title);
          setDescription(data.description);
          setPrice(data.price?.toString() || "");
          setImageUrl(data.imageUrl || "");
        }
      })
      .catch(() => setError("Erro ao carregar item."))
      .finally(() => setLoading(false));
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const res = await fetch(`/api/items/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          price: parseFloat(price),
          imageUrl,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Erro ao atualizar item.");
      } else {
        router.push("/dashboard"); // ✅ volta para o dashboard
      }
    } catch {
      setError("Erro de conexão. Tente novamente.");
    }
  };

  if (loading) return <p>Carregando...</p>;

  return (
    <>
      <UserNavbar /> {/* Navbar integrada */}
      <div className={styles.container}>
        <div className={styles.card}>
          <h1 className={styles.title}>Editar Item</h1>
          <p className={styles.subtitle}>
            Atualize as informações do seu item.
          </p>

          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.inputGroup}>
              <label htmlFor="title">Título</label>
              <input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="description">Descrição</label>
              <textarea
                className={styles.textarea}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="price">Preço (R$)</label>
              <input
                id="price"
                type="number"
                step="0.01"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="imageUrl">Imagem (URL)</label>
              <input
                id="imageUrl"
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
              />
            </div>

            {error && <p className={styles.error}>{error}</p>}

            <button type="submit" className={styles.primaryBtn}>
              Salvar Alterações
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

