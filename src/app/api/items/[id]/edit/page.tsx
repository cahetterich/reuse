// src/app/items/[id]/edit/page.tsx
// "use client";

// import { prisma } from "@/lib/prisma";
// import { redirect } from "next/navigation";

// export default async function EditItemPage({ params }: { params: { id: string } }) {
//   const item = await prisma.item.findUnique({
//     where: { id: Number(params.id) },
//   });

//   if (!item) {
//     return <p>Item não encontrado</p>;
//   }

//   async function updateItem(formData: FormData) {
//     "use server";

//     const title = formData.get("title")?.toString() || "";
//     const description = formData.get("description")?.toString() || "";

//     await prisma.item.update({
//       where: { id: Number(params.id) },
//       data: { title, description },
//     });

//     // 🚀 redireciona de volta para a listagem
//     redirect("/items");
//   }

//   return (
//     <div style={{ maxWidth: "600px", margin: "0 auto" }}>
//       <h1>Editar Item</h1>
//       <form action={updateItem} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
//         <input
//           name="title"
//           defaultValue={item.title}
//           placeholder="Título"
//           style={{ padding: "8px", border: "1px solid #ccc", borderRadius: "6px" }}
//         />
//         <textarea
//           name="description"
//           defaultValue={item.description}
//           placeholder="Descrição"
//           style={{ padding: "8px", border: "1px solid #ccc", borderRadius: "6px" }}
//         />
//         <button
//           type="submit"
//           style={{
//             padding: "8px 12px",
//             backgroundColor: "#5F9070",
//             color: "white",
//             border: "none",
//             borderRadius: "6px",
//             cursor: "pointer",
//           }}
//         >
//           Salvar Alterações
//         </button>
//       </form>
//     </div>
//   );
// }

import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

const CATEGORIES = ["Eletrônicos", "Roupas", "Livros", "Móveis", "Outros"];

export default async function EditItemPage({ params }: { params: { id: string } }) {
  const id = Number(params.id);
  const item = await prisma.item.findUnique({ where: { id } });

  if (!item) {
    return <p style={{ padding: 16 }}>Item não encontrado</p>;
  }

  async function updateItem(formData: FormData) {
    "use server";
    const title = (formData.get("title") || "").toString();
    const description = (formData.get("description") || "").toString();
    const category = (formData.get("category") || "").toString();
    const priceStr = (formData.get("price") || "").toString();
    const imageUrl = (formData.get("imageUrl") || "").toString();
    const status = (formData.get("status") || "").toString(); // opcional

    await prisma.item.update({
      where: { id },
      data: {
        title,
        description,
        category,
        price: priceStr ? Number(priceStr) : null,
        imageUrl: imageUrl || null,
        status: status || item.status,
      },
    });

    redirect("/dashboard");
  }

  return (
    <div style={{ maxWidth: 640, margin: "0 auto", padding: 16, background: "#fff", borderRadius: 12, border: "1px solid #eee" }}>
      <h1 style={{ color: "var(--reuse-dark)", marginBottom: 12 }}>Editar Item</h1>
      <form action={updateItem} style={{ display: "grid", gap: 12 }}>
        <label style={{ display: "grid", gap: 6 }}>
          <span>Título</span>
          <input
            name="title"
            defaultValue={item.title}
            required
            style={{ padding: 10, border: "1px solid #ccc", borderRadius: 8 }}
          />
        </label>

        <label style={{ display: "grid", gap: 6 }}>
          <span>Descrição</span>
          <textarea
            name="description"
            defaultValue={item.description}
            required
            style={{ padding: 10, border: "1px solid #ccc", borderRadius: 8, minHeight: 100 }}
          />
        </label>

        <label style={{ display: "grid", gap: 6 }}>
          <span>Categoria</span>
          <select
            name="category"
            defaultValue={item.category}
            required
            style={{ padding: 10, border: "1px solid #ccc", borderRadius: 8 }}
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </label>

        <label style={{ display: "grid", gap: 6 }}>
          <span>Preço (R$)</span>
          <input
            name="price"
            type="number"
            step="0.01"
            defaultValue={item.price ?? ""}
            style={{ padding: 10, border: "1px solid #ccc", borderRadius: 8 }}
          />
        </label>

        <label style={{ display: "grid", gap: 6 }}>
          <span>Imagem (URL)</span>
          <input
            name="imageUrl"
            type="url"
            defaultValue={item.imageUrl ?? ""}
            style={{ padding: 10, border: "1px solid #ccc", borderRadius: 8 }}
          />
        </label>

        <label style={{ display: "grid", gap: 6 }}>
          <span>Status</span>
          <select
            name="status"
            defaultValue={item.status}
            style={{ padding: 10, border: "1px solid #ccc", borderRadius: 8 }}
          >
            <option value="disponível">disponível</option>
            <option value="reservado">reservado</option>
            <option value="trocado">trocado</option>
          </select>
        </label>

        <button
          type="submit"
          style={{
            padding: "10px 14px",
            backgroundColor: "var(--reuse-green)",
            color: "#fff",
            border: "none",
            borderRadius: 8,
            cursor: "pointer",
            fontWeight: 600
          }}
        >
          Salvar Alterações
        </button>
      </form>
    </div>
  );
}
