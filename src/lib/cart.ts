// src/lib/cart.ts
export type CartItem = {
  id: number;
  title: string;
  price: number | null;
  imageUrl: string | null;
  quantity: number;
};

const KEY = "cart";

function read(): CartItem[] {
  try {
    const raw = localStorage.getItem(KEY);
    const arr = raw ? JSON.parse(raw) : [];
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}

function write(items: CartItem[]) {
  localStorage.setItem(KEY, JSON.stringify(items));
  // avisa a UI (navbar, etc.)
  window.dispatchEvent(new Event("reuse:cart-changed"));
}

export function getCart(): CartItem[] {
  return read();
}

export function addToCart(item: Omit<CartItem, "quantity">, qty = 1) {
  const list = read();
  const idx = list.findIndex((x) => x.id === item.id);
  if (idx >= 0) {
    list[idx].quantity += qty;
  } else {
    list.push({ ...item, quantity: qty });
  }
  write(list);
}

export function removeFromCart(id: number) {
  write(read().filter((x) => x.id !== id));
}

export function clearCart() {
  write([]);
}
