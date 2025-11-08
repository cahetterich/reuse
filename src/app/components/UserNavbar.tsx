// src/app/components/UserNavbar.tsx
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  FaChartPie, FaBox, FaUser, FaCog, FaSearch, FaBell, FaEnvelope, FaBars, FaSignOutAlt,
  FaShoppingCart,   // <-- NOVO
} from "react-icons/fa";
import CartDrawer from "@/app/components/cart/CartDrawer"; // <-- NOVO
import { useCart } from "@/app/components/cart/CartContext"; // <-- NOVO
import styles from "./userNavbar.module.css";

export default function UserNavbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false); // <-- NOVO
  const { count } = useCart(); // <-- NOVO
  const router = useRouter();

  const handleLogout = () => { console.log("Usuário deslogado!"); router.push("/"); };

  return (
    <>
      <button className={styles.menuBtn} onClick={() => setIsOpen(!isOpen)} aria-label="Abrir menu">
        <FaBars size={20} />
      </button>

      <aside className={`${styles.sidebar} ${isOpen ? styles.open : ""}`}>
        <div className={styles.topSection}>
          <h2 className={styles.logo}>ReUse!</h2>

          <nav className={styles.nav}>
            <Link href="/dashboard" className={styles.navLink}><FaChartPie size={18} /> Visão Geral</Link>
            <Link href="/items/my" className={styles.navLink}><FaBox size={18} /> Meus Itens</Link>
            <Link href="/busca" className={styles.navLink}><FaSearch size={18} /> Buscar Itens</Link>
            <Link href="/alerts" className={styles.navLink}><FaBell size={18} /> Alertas</Link>
            <Link href="/messages" className={styles.navLink}><FaEnvelope size={18} /> Mensagens</Link>
            <Link href="/profile" className={styles.navLink}><FaUser size={18} /> Perfil</Link>
            <Link href="/settings" className={styles.navLink}><FaCog size={18} /> Configurações</Link>

            {/* ---- Carrinho ---- */}
            <button className={styles.cartBtn} onClick={() => setCartOpen(true)}>
              <FaShoppingCart size={18} /> Carrinho
              {count > 0 && <span className={styles.badge}>{count}</span>}
            </button>
          </nav>
        </div>

        <button className={styles.logoutBtn} onClick={handleLogout}><FaSignOutAlt size={16} /> Sair</button>
      </aside>

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} /> {/* <-- NOVO */}
    </>
  );
}


