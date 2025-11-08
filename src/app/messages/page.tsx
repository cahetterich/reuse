// src/app/messages/page.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import UserNavbar from "../components/UserNavbar";
import styles from "./messages.module.css";

// Modelo mínimo alinhado ao backend atual
type Message = {
  id: number;
  fromUser: { id: number; name: string };
  toUser: { id: number; name: string };
  subject: string;
  preview: string;
  unread: boolean;
  updatedAt: string; // ISO
};

type Box = "inbox" | "sent" | "archived";

export default function MessagesPage() {
  const [box, setBox] = useState<Box>("inbox");
  const [items, setItems] = useState<Message[]>([]);
  const [q, setQ] = useState("");

  // carrega mensagens da caixa atual
  useEffect(() => {
    // mantemos a rota simples; adapte quando o endpoint real existir
    fetch(`/api/messages?box=${box}`, { cache: "no-store" })
      .then(r => (r.ok ? r.json() : []))
      .then((data: Message[]) => setItems(data ?? []))
      .catch(() => setItems([]));
  }, [box]);

  // filtro client-side por assunto/remetente
  const filtered = useMemo(() => {
    if (!q.trim()) return items;
    const term = q.toLowerCase();
    return items.filter(
      m =>
        m.subject.toLowerCase().includes(term) ||
        m.preview.toLowerCase().includes(term) ||
        m.fromUser.name.toLowerCase().includes(term)
    );
  }, [items, q]);

  return (
    <div className={styles.shell}>
      <UserNavbar />

      <main className={styles.main}>
        <div className="container">
          <h1 className="pageTitle">Mensagens</h1>

          {/* Ações de topo / filtros */}
          <div className={styles.toolbar} role="region" aria-label="Ações e filtros de mensagens">
            <div className={styles.tabs} role="tablist" aria-label="Caixas de mensagem">
              {(["inbox", "sent", "archived"] as Box[]).map(t => (
                <button
                  key={t}
                  role="tab"
                  aria-selected={box === t}
                  className={`${styles.tab} ${box === t ? styles.tabActive : ""}`}
                  onClick={() => setBox(t)}
                >
                  {t === "inbox" ? "Caixa de entrada" : t === "sent" ? "Enviadas" : "Arquivadas"}
                </button>
              ))}
            </div>

            <div className={styles.rightActions}>
              <input
                className={styles.search}
                placeholder="Buscar por assunto ou remetente…"
                aria-label="Buscar mensagens"
                value={q}
                onChange={e => setQ(e.target.value)}
              />
              {/* “Nova conversa” aponta para uma rota futura */}
              <Link href="/messages/new" className={styles.primaryBtn}>
                Nova conversa
              </Link>
            </div>
          </div>

          {/* Lista de threads */}
          {filtered.length > 0 ? (
            <ul className={styles.list} role="list" aria-live="polite">
              {filtered.map(msg => (
                <li
                  key={msg.id}
                  role="listitem"
                  className={`${styles.item} ${msg.unread ? styles.unread : ""}`}
                >
                  <div className={styles.itemMain}>
                    <div className={styles.avatar} aria-hidden="true">
                      {msg.fromUser.name.charAt(0).toUpperCase()}
                    </div>

                    <div className={styles.meta}>
                      <div className={styles.rowTop}>
                        <strong className={styles.from}>
                          {msg.fromUser.name}
                        </strong>
                        <time className={styles.time} dateTime={msg.updatedAt}>
                          {new Date(msg.updatedAt).toLocaleString("pt-BR")}
                        </time>
                      </div>

                      <div className={styles.subject} title={msg.subject}>
                        {msg.subject}
                      </div>
                      <div className={styles.preview} title={msg.preview}>
                        {msg.preview}
                      </div>
                    </div>
                  </div>

                  <div className={styles.actions} aria-label="Ações da conversa">
                    <Link href={`/messages/${msg.id}`} className={styles.ghostBtn}>
                      Abrir
                    </Link>
                    <button className={styles.ghostBtn} onClick={() => {/* arquivar (futuro) */}}>
                      Arquivar
                    </button>
                    {msg.unread && (
                      <button className={styles.ghostBtn} onClick={() => {/* marcar lida (futuro) */}}>
                        Marcar como lida
                      </button>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            // Empty state claro, com call to action; segue boas práticas
            <div className={styles.empty} role="status" aria-live="polite">
              <img
                src="https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f4e8.svg"
                alt=""
                aria-hidden="true"
                className={styles.emptyIcon}
              />
              <h2>Sem mensagens por aqui</h2>
              <p>Quando alguém entrar em contato sobre seus itens, a conversa aparece aqui.</p>
              <Link href="/busca" className={styles.primaryBtn}>
                Explorar itens
              </Link>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
