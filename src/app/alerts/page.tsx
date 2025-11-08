"use client";

import { useEffect, useState, useMemo } from "react";
import UserNavbar from "../components/UserNavbar";
import styles from "./alerts.module.css";

type AlertSeverity = "info" | "warning" | "error";
type AlertKind = "system" | "trade" | "message";

type Alert = {
  id: number;
  kind: AlertKind;
  severity: AlertSeverity;
  title: string;
  description?: string;
  createdAt: string;   // ISO
  read: boolean;
};

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);

  // Carrega da API (não quebra nada se ainda não existir — cai no fallback)
  useEffect(() => {
    let ok = true;
    (async () => {
      try {
        const r = await fetch("/api/alerts", { cache: "no-store" });
        if (r.ok) {
          const data: Alert[] = await r.json();
          if (ok) setAlerts(data);
        } else {
          // Fallback demo (mantém a página útil mesmo sem API)
          if (ok)
            setAlerts([
              {
                id: 1,
                kind: "trade",
                severity: "info",
                title: "Proposta de troca recebida",
                description: "João enviou uma proposta para seu item 'Câmera Canon'.",
                createdAt: new Date().toISOString(),
                read: false,
              },
            ]);
        }
      } catch {
        // Mesmo fallback em caso de erro
        setAlerts([]);
      } finally {
        if (ok) setLoading(false);
      }
    })();
    return () => {
      ok = false;
    };
  }, []);

  const unreadCount = useMemo(() => alerts.filter(a => !a.read).length, [alerts]);

  const markRead = (id: number) =>
    setAlerts(prev => prev.map(a => (a.id === id ? { ...a, read: true } : a)));

  const dismiss = (id: number) =>
    setAlerts(prev => prev.filter(a => a.id !== id));

  const formatWhen = (iso: string) =>
    new Date(iso).toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" });

  return (
    <div className={styles.shell}>
      <UserNavbar />

      <main className={styles.main}>
        <header className={styles.header}>
          <h1 className="pageTitle">
            Alertas & Flags {unreadCount > 0 ? `(${unreadCount})` : ""}
          </h1>
        </header>

        {/* Estado de carregamento */}
        {loading && (
          <div className={styles.loading} role="status" aria-live="polite">
            Carregando alertas…
          </div>
        )}

        {/* Estado vazio */}
        {!loading && alerts.length === 0 && (
          <section
            className={styles.empty}
            role="region"
            aria-label="Sem alertas no momento"
          >
            <div className={styles.emptyIcon} aria-hidden="true">🔔</div>
            <h2>Você está em dia!</h2>
            <p>Sem alertas no momento. Quando algo acontecer, aparece aqui.</p>
            <div className={styles.emptyActions}>
              <a className="btn-primary" href="/busca">Explorar itens</a>
              <a className="btn-secondary" href="/items/my">Ver meus itens</a>
            </div>
          </section>
        )}

        {/* Lista */}
        {!loading && alerts.length > 0 && (
          <section
            className={styles.list}
            role="region"
            aria-live="polite"
            aria-label="Lista de alertas"
          >
            {alerts.map(alert => (
              <article
                key={alert.id}
                className={`${styles.card} ${alert.read ? styles.cardRead : ""}`}
                aria-label={`${alert.title} (${alert.severity})`}
              >
                <div className={styles.icon} aria-hidden="true">
                  {alert.kind === "trade" && "🔁"}
                  {alert.kind === "message" && "✉️"}
                  {alert.kind === "system" && "⚙️"}
                </div>

                <div className={styles.content}>
                  <div className={styles.rowTop}>
                    <h3 className={styles.title}>{alert.title}</h3>
                    <span
                      className={`${styles.badge} ${
                        alert.severity === "error"
                          ? styles.badgeError
                          : alert.severity === "warning"
                          ? styles.badgeWarn
                          : styles.badgeOk
                      }`}
                    >
                      {alert.severity === "error"
                        ? "Crítico"
                        : alert.severity === "warning"
                        ? "Atenção"
                        : "Info"}
                    </span>
                  </div>

                  {alert.description && (
                    <p className={styles.desc}>{alert.description}</p>
                  )}

                  <div className={styles.metaRow}>
                    <span className={styles.when}>{formatWhen(alert.createdAt)}</span>
                    {!alert.read && <span className={styles.dotNew} aria-label="Não lido" />}
                  </div>

                  <div className={styles.actions}>
                    {!alert.read && (
                      <button className={styles.btnPrimary} onClick={() => markRead(alert.id)}>
                        Marcar como lido
                      </button>
                    )}
                    <button className={styles.btnGhost} onClick={() => dismiss(alert.id)}>
                      Dispensar
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </section>
        )}
      </main>
    </div>
  );
}
