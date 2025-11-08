// src/app/components/Navbar.tsx
"use client";

import Link from "next/link";

export default function Navbar() {
  return (
    <nav
      style={{
        backgroundColor: "#5F9070",
        padding: "12px 24px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <Link href="/" style={{ color: "white", fontWeight: "bold", fontSize: "18px" }}>
        ReUse!
      </Link>
      <div style={{ display: "flex", gap: "16px" }}>        
        <Link href="/itens" style={{ color: "white" }}>
          Itens
        </Link>
        <Link href="/login" style={{ color: "white" }}>
          Login
        </Link>
        <Link href="/register" style={{ color: "white" }}>
          Registrar
        </Link>
      </div>
    </nav>
  );
}
