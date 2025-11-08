// src/app/page.tsx
import Image from "next/image";
import { FaRecycle, FaPeopleArrows, FaExchangeAlt } from "react-icons/fa";
import Link from "next/link";
import styles from "./page.module.css";
import PromoBannerPro from "./components/PromoBannerPro";
import TradesBadge from "./components/TradesBadge";

export default function Home() {
  return (
    <main className={styles.container}>
      <PromoBannerPro />
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroText}>
          <h1>ReUse! – repensar, reaproveitar, reconectar</h1>
          <p>
            Uma plataforma para conectar pessoas que desejam doar, trocar ou
            vender objetos pessoais. <br />
            Menos desperdício, mais comunidade.
          </p>
          <div className={styles.actions}>
            <Link href="/register" className={styles.primaryBtn}>
              Criar conta
            </Link>
            <Link href="/items" className={styles.secondaryBtn}>
              Explorar Produtos
            </Link>
          </div>
        </div>
        <div className={styles.heroImage}>
          <Image
            src="/hero.png"
            alt="Ilustração ReUse"
            width={1024} // mantém proporção
            height={671}
            priority
          />
        </div>
      </section>

      {/* Cards Section */}
      <section className={styles.cardsSection}>
        <div className={styles.card}>
          <FaRecycle size={32} color="#5F9070" />
          <h3>Reduza o Desperdício</h3>
          <p>Doe itens que você não usa mais e ajude outras pessoas.</p>
        </div>
        <div className={styles.card} style={{ position: "relative" }}>
          <TradesBadge style={{ position: "absolute", right: 12, top: 10 }} />
          <FaExchangeAlt size={32} color="#5F9070" />
          <h3>Troque Objetos</h3>
          <p>Encontre alguém que precise do que você tem e troque por algo útil.</p>
        </div>
        <div className={styles.card}>
          <FaPeopleArrows size={32} color="#5F9070" />
          <h3>Conecte Pessoas</h3>
          <p>Faça parte de uma comunidade que acredita em sustentabilidade.</p>
        </div>
      </section>
    </main>
  );
}
