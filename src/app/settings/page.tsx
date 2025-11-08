// src/app/settings/page.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import UserNavbar from "../components/UserNavbar";
import styles from "./page.module.css";

/** Estrutura leve para persistência local (demo) */
type Settings = {
  // Aparência / idioma
  theme: "system" | "light" | "dark";
  language: "pt-BR" | "en-US" | "es-ES" | "nl-NL";
  currency: "BRL" | "USD" | "EUR";

  // Notificações
  notifyMessages: boolean;
  notifyTrades: boolean;
  newsletter: boolean;

  // Privacidade
  publicProfile: boolean;
  showEmail: boolean;
  showPhone: boolean;

  // Acessibilidade
  fontScale: "100" | "110" | "125" | "150";
  highContrast: boolean;
};

const DEFAULTS: Settings = {
  theme: "system",
  language: "pt-BR",
  currency: "BRL",

  notifyMessages: true,
  notifyTrades: true,
  newsletter: false,

  publicProfile: true,
  showEmail: false,
  showPhone: false,

  fontScale: "100",
  highContrast: false,
};

export default function SettingsPage() {
  const [settings, setSettings] = useState<Settings>(DEFAULTS);
  const [saving, setSaving] = useState(false);

  // carrega settings (e sincroniza com prefs do user, se houver)
  useEffect(() => {
    const raw = localStorage.getItem("settings");
    const loaded = raw ? (JSON.parse(raw) as Settings) : DEFAULTS;
    setSettings({ ...DEFAULTS, ...loaded });

    const userRaw = localStorage.getItem("user");
    if (userRaw) {
      try {
        const u = JSON.parse(userRaw);
        setSettings((s) => ({
          ...s,
          notifyMessages: u?.prefs?.notifyMessages ?? s.notifyMessages,
          notifyTrades: u?.prefs?.notifyTrades ?? s.notifyTrades,
          newsletter: u?.prefs?.newsletter ?? s.newsletter,
        }));
      } catch {
        /* ignore */
      }
    }
  }, []);

  // acessibilidade: aplica escala de fonte e alto contraste no <html>
  useEffect(() => {
    const html = document.documentElement;
    html.style.fontSize =
      settings.fontScale === "100"
        ? ""
        : settings.fontScale === "110"
        ? "110%"
        : settings.fontScale === "125"
        ? "125%"
        : "150%";

    if (settings.highContrast) {
      html.style.setProperty("--reuse-light", "#fff");
      html.style.setProperty("--reuse-text", "#222");
      // bordas ligeiramente mais escuras no alto contraste
      html.style.setProperty("--reuse-accent", "#AA4A1F");
    } else {
      // volta ao padrão do seu globals.css
      html.style.removeProperty("--reuse-light");
      html.style.removeProperty("--reuse-text");
      html.style.removeProperty("--reuse-accent");
    }
  }, [settings.fontScale, settings.highContrast]);

  // tema (apenas adiciona data-attr para possível futura implementação)
  useEffect(() => {
    const html = document.documentElement;
    html.dataset.theme = settings.theme; // "system" | "light" | "dark"
  }, [settings.theme]);

  const update = <K extends keyof Settings>(key: K, value: Settings[K]) =>
    setSettings((s) => ({ ...s, [key]: value }));

  const saveAll = async () => {
    setSaving(true);

    // salva settings
    localStorage.setItem("settings", JSON.stringify(settings));

    // espelha prefs dentro do 'user' (mesmo contrato que já usamos)
    const userRaw = localStorage.getItem("user");
    if (userRaw) {
      try {
        const u = JSON.parse(userRaw);
        u.prefs = {
          ...(u.prefs ?? {}),
          newsletter: settings.newsletter,
          notifyMessages: settings.notifyMessages,
          notifyTrades: settings.notifyTrades,
        };
        localStorage.setItem("user", JSON.stringify(u));
      } catch {
        /* ignore */
      }
    }

    await new Promise((r) => setTimeout(r, 400));
    setSaving(false);
  };

  const resetToDefaults = () => {
    if (!confirm("Voltar às configurações padrão?")) return;
    setSettings(DEFAULTS);
  };

  const exportData = () => {
    // exporta user + settings em um JSON simples (demo)
    const data = {
      user: (() => {
        try {
          return JSON.parse(localStorage.getItem("user") || "null");
        } catch {
          return null;
        }
      })(),
      settings,
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "reuse-export.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const clearCache = () => {
    if (!confirm("Limpar cache local (sem sair)?")) return;
    // mantém 'user', apaga 'favorites' e 'cart' para não quebrar nada
    localStorage.removeItem("favorites");
    localStorage.removeItem("cart");
    alert("Cache limpo com sucesso.");
  };

  const langLabel = useMemo(() => {
    const map: Record<Settings["language"], string> = {
      "pt-BR": "Português (Brasil)",
      "en-US": "English (US)",
      "es-ES": "Español",
      "nl-NL": "Nederlands",
    };
    return map[settings.language];
  }, [settings.language]);

  return (
    <div className={styles.layout}>
      <UserNavbar />

      <main className={styles.main}>
        <h1 className="pageTitle">Configurações</h1>

        {/* Aparência & idioma */}
        <section className={styles.card}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Aparência & Idioma</h2>
          </div>

          <div className={styles.grid3}>
            <label className={styles.field}>
              <span>Tema</span>
              <select
                className={styles.select}
                value={settings.theme}
                onChange={(e) => update("theme", e.target.value as Settings["theme"])}
              >
                <option value="system">Automático (sistema)</option>
                <option value="light">Claro</option>
                <option value="dark">Escuro</option>
              </select>
            </label>

            <label className={styles.field}>
              <span>Idioma</span>
              <select
                className={styles.select}
                value={settings.language}
                onChange={(e) => update("language", e.target.value as Settings["language"])}
              >
                <option value="pt-BR">Português (Brasil)</option>
                <option value="en-US">English (US)</option>
                <option value="es-ES">Español</option>
                <option value="nl-NL">Nederlands</option>
              </select>
            </label>

            <label className={styles.field}>
              <span>Moeda</span>
              <select
                className={styles.select}
                value={settings.currency}
                onChange={(e) => update("currency", e.target.value as Settings["currency"])}
              >
                <option value="BRL">Real (BRL)</option>
                <option value="USD">Dólar (USD)</option>
                <option value="EUR">Euro (EUR)</option>
              </select>
            </label>
          </div>

          <p className={styles.muted}>Idioma atual: <strong>{langLabel}</strong>.</p>
        </section>

        {/* Notificações */}
        <section className={styles.card}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Notificações</h2>
          </div>

          <div className={styles.toggles}>
            <label className={styles.toggle}>
              <input
                type="checkbox"
                checked={settings.notifyMessages}
                onChange={(e) => update("notifyMessages", e.target.checked)}
              />
              <span>Alertas de novas mensagens</span>
            </label>
            <label className={styles.toggle}>
              <input
                type="checkbox"
                checked={settings.notifyTrades}
                onChange={(e) => update("notifyTrades", e.target.checked)}
              />
              <span>Propostas de troca</span>
            </label>
            <label className={styles.toggle}>
              <input
                type="checkbox"
                checked={settings.newsletter}
                onChange={(e) => update("newsletter", e.target.checked)}
              />
              <span>Receber novidades e dicas do ReUse!</span>
            </label>
          </div>
        </section>

        {/* Privacidade */}
        <section className={styles.card}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Privacidade</h2>
          </div>

          <div className={styles.toggles}>
            <label className={styles.toggle}>
              <input
                type="checkbox"
                checked={settings.publicProfile}
                onChange={(e) => update("publicProfile", e.target.checked)}
              />
              <span>Perfil público</span>
            </label>
            <label className={styles.toggle}>
              <input
                type="checkbox"
                checked={settings.showEmail}
                onChange={(e) => update("showEmail", e.target.checked)}
              />
              <span>Exibir e-mail no perfil</span>
            </label>
            <label className={styles.toggle}>
              <input
                type="checkbox"
                checked={settings.showPhone}
                onChange={(e) => update("showPhone", e.target.checked)}
              />
              <span>Exibir telefone no perfil</span>
            </label>
          </div>
        </section>

        {/* Acessibilidade */}
        <section className={styles.card}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Acessibilidade</h2>
          </div>

          <div className={styles.grid3}>
            <label className={styles.field}>
              <span>Tamanho da fonte</span>
              <select
                className={styles.select}
                value={settings.fontScale}
                onChange={(e) => update("fontScale", e.target.value as Settings["fontScale"])}
              >
                <option value="100">Padrão</option>
                <option value="110">+10%</option>
                <option value="125">+25%</option>
                <option value="150">+50%</option>
              </select>
            </label>

            <label className={styles.field}>
              <span>Contraste</span>
              <label className={styles.toggleInline}>
                <input
                  type="checkbox"
                  checked={settings.highContrast}
                  onChange={(e) => update("highContrast", e.target.checked)}
                />
                <span>Alto contraste</span>
              </label>
            </label>
          </div>
        </section>

        {/* Ações globais */}
        <section className={styles.card}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Dados & Cache</h2>
          </div>

          <div className={styles.actionsRow}>
            <button className="btn-secondary" onClick={exportData}>Exportar dados (JSON)</button>
            <button className="btn-secondary" onClick={clearCache}>Limpar cache local</button>
            <button className="btn-primary" onClick={saveAll} disabled={saving}>
              {saving ? "Salvando..." : "Salvar configurações"}
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}

