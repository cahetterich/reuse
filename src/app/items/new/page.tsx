// src/app/items/new/page.tsx

// "use client";

// import { useState } from "react";
// import { useRouter } from "next/navigation";
// import styles from "./newItem.module.css";

// export default function NewItemPage() {
//   const router = useRouter();
//   const [title, setTitle] = useState("");
//   const [description, setDescription] = useState("");
//   const [price, setPrice] = useState("");
//   const [imageUrl, setImageUrl] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setError(null);
//     setLoading(true);

//     try {
//       const storedUser = localStorage.getItem("user");
//       if (!storedUser) {
//         setError("Usuário não autenticado.");
//         setLoading(false);
//         return;
//       }
//       const user = JSON.parse(storedUser);

//       const res = await fetch("/api/items", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           title,
//           description,
//           price: parseFloat(price),
//           imageUrl,
//           userId: user.id,
//         }),
//       });

//       if (!res.ok) {
//         const data = await res.json();
//         setError(data.error || "Erro ao cadastrar item.");
//       } else {
//         router.push("/dashboard"); // ✅ volta para dashboard
//       }
//     } catch (err) {
//       setError("Erro de conexão. Tente novamente.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className={styles.container}>
//       <div className={styles.card}>
//         <h1 className={styles.title}>Adicionar Novo Item</h1>
//         <p className={styles.subtitle}>
//           Preencha os campos abaixo para cadastrar seu item na plataforma.
//         </p>

//         <form className={styles.form} onSubmit={handleSubmit}>
//           <div className={styles.inputGroup}>
//             <label htmlFor="title">Título</label>
//             <input
//               id="title"
//               type="text"
//               value={title}
//               onChange={(e) => setTitle(e.target.value)}
//               placeholder="Ex: Celular usado"
//               required
//             />
//           </div>

//           <div className={styles.inputGroup}>
//             <label htmlFor="description">Descrição</label>
//             <textarea className={styles.textarea}
//               name="description"
//               value={description}
//               onChange={(e) => setDescription(e.target.value)}
//               placeholder="Descreva seu item"
//               required
//             />
//           </div>

//           <div className={styles.inputGroup}>
//             <label htmlFor="price">Preço (R$)</label>
//             <input
//               id="price"
//               type="number"
//               step="0.01"
//               value={price}
//               onChange={(e) => setPrice(e.target.value)}
//               placeholder="Ex: 200.00"
//               required
//             />
//           </div>

//           <div className={styles.inputGroup}>
//             <label htmlFor="imageUrl">Imagem (URL)</label>
//             <input
//               id="imageUrl"
//               type="url"
//               value={imageUrl}
//               onChange={(e) => setImageUrl(e.target.value)}
//               placeholder="https://via.placeholder.com/300x200"
//               required
//             />
//           </div>

//           {error && <p className={styles.error}>{error}</p>}

//           <button type="submit" className={styles.primaryBtn} disabled={loading}>
//             {loading ? "Salvando..." : "Cadastrar Item"}
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// }

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./newItem.module.css";

const CATEGORIES = ["Eletrônicos", "Roupas", "Livros", "Móveis", "Outros"];

export default function NewItemPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [price, setPrice] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const storedUser = localStorage.getItem("user");
      if (!storedUser) {
        setError("Usuário não autenticado.");
        setLoading(false);
        return;
      }
      const user = JSON.parse(storedUser);

      const res = await fetch("/api/items", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          category,
          price: price ? parseFloat(price) : null,
          imageUrl: imageUrl || null,
          userId: user.id,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Erro ao cadastrar item.");
      } else {
        router.push("/dashboard");
      }
    } catch (err) {
      setError("Erro de conexão. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>Adicionar Novo Item</h1>
        <p className={styles.subtitle}>
          Preencha os campos abaixo para cadastrar seu item na plataforma.
        </p>

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.inputGroup}>
            <label htmlFor="title">Título</label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Celular usado"
              required
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="description">Descrição</label>
            <textarea
              id="description"
              className={styles.textarea}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Descreva seu item"
              required
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="category">Categoria</label>
            <select
              id="category"
              className={styles.select}
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="price">Preço (R$)</label>
            <input
              id="price"
              type="number"
              step="0.01"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="Ex: 200.00"
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="imageUrl">Imagem (URL)</label>
            <input
              id="imageUrl"
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://via.placeholder.com/300x200"
            />
          </div>

          {error && <p className={styles.error}>{error}</p>}

          <button type="submit" className={styles.primaryBtn} disabled={loading}>
            {loading ? "Salvando..." : "Cadastrar Item"}
          </button>
        </form>
      </div>
    </div>
  );
}
