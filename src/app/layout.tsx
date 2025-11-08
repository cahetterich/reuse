// src/app/layout.tsx
"use client";

import "./globals.css";
import { usePathname } from "next/navigation";
import Link from "next/link";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Tudo que for área logada: escondemos o header público do marketing
  const isUserArea = /^\/(dashboard|items|busca|alerts|messages|profile|settings|cart|carrinho)/i.test(
    pathname || ""
  );

  return (
    <html lang="pt-BR">
      <body>
        {!isUserArea && (
          <header
            style={{
              background: "var(--reuse-green)",
              color: "#fff",
              padding: "10px 16px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <strong>ReUse!</strong>
            <nav style={{ display: "flex", gap: 16 }}>
              <Link href="/busca">Itens</Link>
              <Link href="/login">Login</Link>
              <Link href="/register">Registrar</Link>
            </nav>
          </header>
        )}

        {/* Conteúdo das páginas */}
        {children}
      </body>
    </html>
  );
}
                                                                                                                                                                                                                                                                         