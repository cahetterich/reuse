// src/app/dashboard/page.tsx

// "use client";

// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
// import { FaEdit, FaTrash } from "react-icons/fa";
// import styles from "./dashboard.module.css";

// interface User {
//   id: number;
//   name: string;
//   email: string;
// }

// interface Item {
//   id: number;
//   title: string;
//   description: string;
//   price: number;
//   imageUrl: string;
//   isActive: boolean;
// }

// export default function DashboardPage() {
//   const [user, setUser] = useState<User | null>(null);
//   const [items, setItems] = useState<Item[]>([]);
//   const router = useRouter();

//   useEffect(() => {
//     const storedUser = localStorage.getItem("user");
//     if (storedUser) {
//       const parsedUser = JSON.parse(storedUser);
//       setUser(parsedUser);

//       fetch(`/api/items?userId=${parsedUser.id}`)
//         .then((res) => res.json())
//         .then((data) => setItems(data))
//         .catch((err) => console.error("Erro ao buscar itens:", err));
//     }
//   }, []);

//   const handleToggle = async (id: number, isActive: boolean) => {
//     await fetch(`/api/items/${id}/toggle`, { method: "PUT" });
//     setItems((prev) =>
//       prev.map((item) =>
//         item.id === id ? { ...item, isActive: !isActive } : item
//       )
//     );
//   };

//   const handleDelete = async (id: number) => {
//     if (!confirm("Tem certeza que deseja excluir este item?")) return;
//     await fetch(`/api/items/${id}`, { method: "DELETE" });
//     setItems((prev) => prev.filter((item) => item.id !== id));
//   };

//   return (
//     <div className={styles.container}>
//       <header className={styles.header}>
//         <h1>Bem-vindo de volta, {user?.name || "Usuário"}!</h1>
//       </header>

//       {/* Cards de resumo */}
//       <section className={styles.cards}>
//         <div className={styles.card}>
//           <h3>Itens cadastrados</h3>
//           <p className={styles.cardNumber}>{items.length}</p>
//         </div>
//         <div className={styles.card}>
//           <h3>Trocas realizadas</h3>
//           <p className={styles.cardNumber}>0</p>
//         </div>
//         <div className={styles.card}>
//           <h3>Mensagens</h3>
//           <p className={styles.cardNumber}>0</p>
//         </div>
//       </section>

//       {/* Últimos itens */}
//       <section className={styles.itemsSection}>
//         <div className={styles.sectionHeader}>
//           <h2>Últimos Itens</h2>
//           <button
//             className={styles.addBtn}
//             onClick={() => router.push("/items/new")}
//           >
//             + Adicionar item
//           </button>
//         </div>

//         {items.length > 0 ? (
//           <div className={styles.itemsGrid}>
//             {items.slice(0, 6).map((item) => (
//               <div key={item.id} className={styles.itemCard}>
//                 <img
//                   src={item.imageUrl}
//                   alt={item.title}
//                   className={styles.itemImage}
//                 />
//                 <div className={styles.itemContent}>
//                   <h3>{item.title}</h3>
//                   <p>{item.description}</p>
//                   <p className={styles.price}>R$ {item.price.toFixed(2)}</p>

//                   <div className={styles.actions}>
//                     {/* Toggle ativo/inativo */}
//                     <label className={styles.switch}>
//                       <input
//                         type="checkbox"
//                         checked={item.isActive}
//                         onChange={() => handleToggle(item.id, item.isActive)}
//                       />
//                       <span className={styles.slider}></span>
//                     </label>

//                     {/* Editar */}
//                     <button className={styles.editBtn}>
//                       <FaEdit size={14} /> Editar
//                     </button>

//                     {/* Excluir */}
//                     <button
//                       className={styles.deleteBtn}
//                       onClick={() => handleDelete(item.id)}
//                     >
//                       <FaTrash size={14} /> Excluir
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         ) : (
//           <p>Nenhum item cadastrado ainda.</p>
//         )}
//       </section>
//     </div>
//   );
// }

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FaEdit, FaTrash } from "react-icons/fa";
import styles from "./dashboard.module.css";

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
  status: string; // "disponível" | "indisponível"
  isActive: boolean;
}

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [items, setItems] = useState<Item[]>([]);
  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);

      fetch(`/api/items?userId=${parsedUser.id}`)
        .then((res) => res.json())
        .then((data) => setItems(data))
        .catch((err) => console.error("Erro ao buscar itens:", err));
    }
  }, []);

  const handleToggle = async (id: number, isActive: boolean) => {
    await fetch(`/api/items/${id}/toggle`, { method: "PUT" });
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, isActive: !isActive } : item
      )
    );
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Tem certeza que deseja excluir este item?")) return;
    await fetch(`/api/items/${id}`, { method: "DELETE" });
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className="pageTitle">Bem-vindo de volta, {user?.name || "Usuário"}!</h1>
      </header>

      {/* Cards de resumo (mantidos) */}
      <section className={styles.cards}>
        <div className={styles.card}>
          <h3>Itens cadastrados</h3>
          <p className={styles.cardNumber}>{items.length}</p>
        </div>
        <div className={styles.card}>
          <h3>Trocas realizadas</h3>
          <p className={styles.cardNumber}>0</p>
        </div>
        <div className={styles.card}>
          <h3>Mensagens</h3>
          <p className={styles.cardNumber}>0</p>
        </div>
      </section>

      {/* Últimos itens (cards profissionais) */}
      <section className={styles.itemsSection}>
        <div className={styles.sectionHeader}>
          <h2>Últimos Itens</h2>
          <button
            className={styles.addBtn}
            onClick={() => router.push("/items/new")}
          >
            + Adicionar item
          </button>
        </div>

        {items.length > 0 ? (
          <div className={styles.itemsGrid}>
            {items.slice(0, 6).map((item) => (
              <div key={item.id} className={styles.itemCard}>
                <img
                  src={
                    item.imageUrl ||
                    "https://via.placeholder.com/300x200?text=Item"
                  }
                  alt={item.title}
                  className={styles.itemImage}
                />

                <div className={styles.itemContent}>
                  <div className={styles.itemHeader}>
                    <h3>{item.title}</h3>
                    <span
                      className={
                        item.isActive
                          ? styles.statusAvailable
                          : styles.statusTraded
                      }
                    >
                      {item.isActive ? "Disponível" : "Indisponível"}
                    </span>
                  </div>

                  <p className={styles.itemDescription}>{item.description}</p>
                  <div className={styles.metaRow}>
                    <span className={styles.badge}>{item.category}</span>
                    {item.price != null && (
                      <span className={styles.price}>
                        R$ {item.price.toFixed(2)}
                      </span>
                    )}
                  </div>

                  <div className={styles.actions}>
                    {/* Toggle ativo/inativo */}
                    <label className={styles.switch} title="Ativo/Inativo">
                      <input
                        type="checkbox"
                        checked={item.isActive}
                        onChange={() => handleToggle(item.id, item.isActive)}
                      />
                      <span className={styles.slider}></span>
                    </label>

                    {/* Editar */}
                    <button
                      className={styles.editBtn}
                      onClick={() => router.push(`/items/${item.id}/edit`)}
                    >
                      <FaEdit size={14} /> Editar
                    </button>

                    {/* Excluir */}
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
        ) : (
          <p>Nenhum item cadastrado ainda.</p>
        )}
      </section>
    </div>
  );
}
