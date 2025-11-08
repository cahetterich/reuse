// src/app/components/UserNavbar.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  FaChartPie,
  FaBox,
  FaUser,
  FaCog,
  FaSearch,
  FaBell,
  FaEnvelope,
  FaBars,
  FaSignOutAlt,
  FaShoppingCart,
} from "react-icons/fa";
import styles from "./userNavbar.module.css";

export default function UserNavbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const router = useRouter();

  // contador do carrinho (lido do localStorage)
  useEffect(() => {
    const read = () => {
      try {
        const raw = localStorage.getItem("cart");
        if (!raw) return setCartCount(0);
        const arr = JSON.parse(raw) as any[];
        setCartCount(Array.isArray(arr) ? arr.length : 0);
      } catch {
        setCartCount(0);
      }
    };
    read();

    // atualiza quando outras partes do app disparam o evento
    const onCartChanged = () => read();
    window.addEventListener("reuse:cart-changed", onCartChanged);
    return () => window.removeEventListener("reuse:cart-changed", onCartChanged);
  }, []);

  const handleLogout = () => {
    // (futuro) limpar sessão/token
    router.push("/");
  };

  return (
    <>
      {/* Botão hambúrguer (mobile) */}
      <button
        className={styles.menuBtn}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Abrir menu"
      >
        <FaBars size={20} />
      </button>

      {/* Sidebar */}
      <aside className={`${styles.sidebar} ${isOpen ? styles.open : ""}`}>
        <div className={styles.topSection}>
          <h2 className={styles.logo}>ReUse!</h2>

          <nav className={styles.nav}>
            <Link href="/dashboard" className={styles.navLink}>
              <FaChartPie size={18} /> Visão Geral
            </Link>
            <Link href="/items/my" className={styles.navLink}>
              <FaBox size={18} /> Meus Itens
            </Link>
            <Link href="/busca" className={styles.navLink}>
              <FaSearch size={18} /> Buscar Itens
            </Link>
            <Link href="/alerts" className={styles.navLink}>
              <FaBell size={18} /> Alertas
            </Link>
            <Link href="/messages" className={styles.navLink}>
              <FaEnvelope size={18} /> Mensagens
            </Link>
            <Link href="/profile" className={styles.navLink}>
              <FaUser size={18} /> Perfil
            </Link>
            <Link href="/settings" className={styles.navLink}>
              <FaCog size={18} /> Configurações
            </Link>

            {/* Carrinho */}
            <Link href="/cart" className={`${styles.navLink} ${styles.cartLink}`}>
              <FaShoppingCart size={18} />
              <span>Carrinho</span>
              <span className={styles.badge} aria-label={`${cartCount} itens no carrinho`}>
                {cartCount}
              </span>
            </Link>
          </nav>
        </div>

        <button className={styles.logoutBtn} onClick={handleLogout}>
          <FaSignOutAlt size={16} /> Sair
        </button>
      </aside>
    </>
  );
}


