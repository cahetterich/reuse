// src/app/components/cart/CartDrawer.tsx

"use client";
import styles from "./cartDrawer.module.css";
import { useCart } from "./CartContext";

export default function CartDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { items, remove, total, clear } = useCart();
  if (!open) return null;

  return (
    <>
      <div className={styles.scrim} onClick={onClose} />
      <aside className={styles.drawer} role="dialog" aria-modal="true" aria-label="Carrinho">
        <header className={styles.header}>
          <h2>Carrinho</h2>
          <button className={styles.close} onClick={onClose} aria-label="Fechar">×</button>
        </header>

        <div className={styles.list}>
          {items.length === 0 ? (
            <p>Nenhum item no carrinho.</p>
          ) : items.map((it) => (
            <div key={it.id} className={styles.row}>
              <img src={it.imageUrl ?? "https://via.placeholder.com/64"} alt="" />
              <div className={styles.info}>
                <strong>{it.title}</strong>
                {it.price != null && <span>R$ {it.price.toFixed(2)}</span>}
              </div>
              <button className={styles.remove} onClick={() => remove(it.id)}>Remover</button>
            </div>
          ))}
        </div>

        <footer className={styles.footer}>
          <div className={styles.total}>
            <span>Total</span>
            <strong>R$ {total.toFixed(2)}</strong>
          </div>
          <div className={styles.actions}>
            <button className="btn-secondary" onClick={clear}>Esvaziar</button>
            <button className="btn-primary">Finalizar compra</button>
          </div>
        </footer>
      </aside>
    </>
  );
}

