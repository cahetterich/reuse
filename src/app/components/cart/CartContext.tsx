// src/app/components/cart/CartContext.tsx
"use client";
import { createContext, useContext, useEffect, useMemo, useState } from "react";

export type CartItem = { id: number; title: string; price?: number | null; imageUrl?: string | null; };

type CartState = {
  items: CartItem[];
  add: (item: CartItem) => void;
  remove: (id: number) => void;
  clear: () => void;
  count: number;
  total: number;
};

const Ctx = createContext<CartState | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    const raw = localStorage.getItem("cart");
    if (raw) setItems(JSON.parse(raw));
  }, []);
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(items));
  }, [items]);

  const api = useMemo<CartState>(() => ({
    items,
    add: (i) => setItems((prev) => prev.find(p => p.id === i.id) ? prev : [...prev, i]),
    remove: (id) => setItems((prev) => prev.filter(p => p.id !== id)),
    clear: () => setItems([]),
    count: items.length,
    total: items.reduce((s, i) => s + (i.price ?? 0), 0),
  }), [items]);

  return <Ctx.Provider value={api}>{children}</Ctx.Provider>;
}
export function useCart() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}

