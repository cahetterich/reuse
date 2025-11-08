// src/app/Chrome.tsx
"use client";
import { usePathname } from "next/navigation";
import Navbar from "./components/Navbar";
import { CartProvider } from "./components/cart/CartContext";

const HIDE_NAV_ON = ["/dashboard", "/profile", "/settings", "/items", "/busca"];

export default function Chrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const hideChrome = HIDE_NAV_ON.some((p) => pathname.startsWith(p));

  return (
    <CartProvider>
      {!hideChrome && <Navbar />}
      <main>{children}</main>
      {!hideChrome && (
        <footer
          style={{
            marginTop: "40px",
            padding: "20px",
            textAlign: "center",
            background: "white",
            borderTop: "1px solid #ddd",
          }}
        >
          <p>© {new Date().getFullYear()} ReUse! – Plataforma de Troca Sustentável</p>
        </footer>
      )}
    </CartProvider>
  );
}
