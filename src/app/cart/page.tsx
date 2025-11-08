// src/app/cart/page.tsx
"use client";

import { useEffect, useState } from "react";
import { CartItem, getCart, removeFromCart, clearCart } from "../../lib/cart";

export default function CartPage() {
  const [items, setItems] = useState<CartItem[]>([]);

  const read = () => setItems(getCart());

  useEffect(() => {
    read();
    const onChange = () => read();
    window.addEventListener("reuse:cart-changed", onChange);
    return () => window.removeEventListener("reuse:cart-changed", onChange);
  }, []);

  const total = items.reduce((acc, it) => acc + (it.price ?? 0) * it.quantity, 0);

  return (
    <div className="container" style={{ padding: 24 }}>
      <h1 className="pageTitle">Meu Carrinho</h1>

      {items.length === 0 ? (
        <p>Seu carrinho está vazio.</p>
      ) : (
        <>
          <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: 12 }}>
            {items.map((it) => (
              <li
                key={it.id}
                style={{
                  display: "flex",
                  gap: 12,
                  alignItems: "center",
                  background: "#fff",
                  padding: 12,
                  border: "1px solid #eee",
                  borderRadius: 12,
                }}
              >
                <img
                  src={it.imageUrl || "https://via.placeholder.com/96x72?text=Item"}
                  alt={it.title}
                  width={96}
                  height={72}
                  style={{ objectFit: "cover", borderRadius: 8 }}
                />
                <div style={{ flex: 1 }}>
                  <strong>{it.title}</strong>
                  <div style={{ color: "var(--reuse-text)" }}>
                    {it.quantity} ×{" "}
                    {(it.price ?? 0).toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    })}
                  </div>
                </div>
                <button
                  className="btn-secondary"
                  onClick={() => {
                    removeFromCart(it.id);
                    read();
                  }}
                >
                  Remover
                </button>
              </li>
            ))}
          </ul>

          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 16 }}>
            <button className="btn-secondary" onClick={() => { clearCart(); read(); }}>
              Limpar carrinho
            </button>
            <strong>
              Total:{" "}
              {total.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
            </strong>
          </div>
        </>
      )}
    </div>
  );
}
