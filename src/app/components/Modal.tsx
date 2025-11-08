// src/app/components/Modal.tsx

"use client";

import { useEffect, useRef } from "react";
import styles from "./modal.module.css";

type ModalProps = {
  open: boolean;
  title?: string;
  onClose: () => void;
  children: React.ReactNode;
};

export default function Modal({ open, title, onClose, children }: ModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);

  // fecha com ESC
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  // foco inicial + retorno do foco ao fechar (focus trap básico)
  useEffect(() => {
    if (open) {
      previouslyFocused.current = document.activeElement as HTMLElement | null;
      const first = dialogRef.current?.querySelector<HTMLElement>("[data-autofocus]") ??
                    dialogRef.current?.querySelector<HTMLElement>("button, a, input, textarea, select, [tabindex]:not([tabindex='-1'])");
      first?.focus();
      // bloqueia scroll da página por trás
      document.documentElement.style.overflow = "hidden";
    } else {
      document.documentElement.style.overflow = "";
      previouslyFocused.current?.focus();
    }
  }, [open]);

  // impedir clique “por dentro” de fechar
  const stop = (e: React.MouseEvent) => e.stopPropagation();

  if (!open) return null;

  return (
    <div
      className={styles.backdrop}
      onClick={onClose}
      aria-hidden="true"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={styles.dialog}
        onClick={stop}
        ref={dialogRef}
      >
        {title && <h2 className={styles.title}>{title}</h2>}
        <button className={styles.closeBtn} onClick={onClose} aria-label="Fechar">×</button>
        <div className={styles.content}>{children}</div>
      </div>
    </div>
  );
}
