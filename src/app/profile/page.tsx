// src/app/profile/page.tsx
"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import UserNavbar from "../components/UserNavbar";
import styles from "./page.module.css";

type User = {
  id: number;
  name: string;
  email: string;
  phone?: string;
  city?: string;
  country?: string;
  avatarUrl?: string | null;
  // preferências simples salvas localmente (mantém contrato atual sem API nova)
  prefs?: {
    newsletter?: boolean;
    notifyMessages?: boolean;
    notifyTrades?: boolean;
  };
};

export default function ProfilePage() {
  const [me, setMe] = useState<User | null>(null);
  const [saving, setSaving] = useState(false);
  const fileRef = useRef<HTMLInputElement | null>(null);

  // carrega do mesmo "contrato" que você já usa (localStorage 'user')
  useEffect(() => {
    const raw = localStorage.getItem("user");
    if (raw) {
      const u = JSON.parse(raw);
      // normaliza structure
      setMe({
        id: u.id,
        name: u.name ?? "",
        email: u.email ?? "",
        phone: u.phone ?? "",
        city: u.city ?? "",
        country: u.country ?? "",
        avatarUrl: u.avatarUrl ?? null,
        prefs: {
          newsletter: u?.prefs?.newsletter ?? false,
          notifyMessages: u?.prefs?.notifyMessages ?? true,
          notifyTrades: u?.prefs?.notifyTrades ?? true,
        },
      });
    }
  }, []);

  const initials = useMemo(() => {
    if (!me?.name) return "U";
    const parts = me.name.trim().split(/\s+/);
    const a = parts[0]?.[0] ?? "";
    const b = parts[parts.length - 1]?.[0] ?? "";
    return (a + b).toUpperCase();
  }, [me?.name]);

  const onPickAvatar = () => fileRef.current?.click();

  const onFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !me) return;
    const reader = new FileReader();
    reader.onload = () => {
      setMe({ ...me, avatarUrl: String(reader.result) });
    };
    reader.readAsDataURL(file);
  };

  const update = (patch: Partial<User>) => me && setMe({ ...me, ...patch });
  const updatePrefs = (patch: Partial<NonNullable<User["prefs"]>>) =>
    me && setMe({ ...me, prefs: { ...(me.prefs ?? {}), ...patch } });

  const save = async (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!me) return;
    setSaving(true);

    // mantém o contrato atual (localStorage) — sem tocar API
    localStorage.setItem("user", JSON.stringify(me));

    // se quiser, depois trocamos por PATCH /api/me
    await new Promise((r) => setTimeout(r, 400)); // micro feedback
    setSaving(false);
  };

  const changePassword = async (ev: React.FormEvent) => {
    ev.preventDefault();
    // fluxo mockado para demo
    alert("Link de redefinição de senha enviado para o seu e-mail (demo).");
  };

  const pauseOffers = () => {
    alert("Suas ofertas foram pausadas (demo).");
  };

  const deleteAccount = () => {
    if (!confirm("Tem certeza? Esta ação não pode ser desfeita.")) return;
    // demo: apenas limpa localStorage e volta pra Home
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  return (
    <div className={styles.layout}>
      <UserNavbar />

      <main className={styles.main}>
        <h1 className="pageTitle">Perfil</h1>

        {/* Card: Foto + dados básicos */}
        <section className={styles.card}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Sua conta</h2>
          </div>

          <div className={styles.profileRow}>
            <div className={styles.avatarCol}>
              <div className={styles.avatarWrap} onClick={onPickAvatar} role="button" aria-label="Alterar foto">
                {me?.avatarUrl ? (
                  <img src={me.avatarUrl} alt="Foto do perfil" className={styles.avatarImg} />
                ) : (
                  <div className={styles.avatarFallback}>{initials}</div>
                )}
                <span className={styles.avatarHint}>Trocar foto</span>
              </div>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                className={styles.hiddenFile}
                onChange={onFile}
              />
            </div>

            <form className={styles.formCol} onSubmit={save}>
              <div className={styles.grid2}>
                <label className={styles.field}>
                  <span>Nome</span>
                  <input
                    className={styles.input}
                    value={me?.name ?? ""}
                    onChange={(e) => update({ name: e.target.value })}
                    placeholder="Seu nome"
                  />
                </label>

                <label className={styles.field}>
                  <span>E-mail</span>
                  <input
                    className={styles.input}
                    type="email"
                    value={me?.email ?? ""}
                    onChange={(e) => update({ email: e.target.value })}
                    placeholder="voce@exemplo.com"
                  />
                </label>

                <label className={styles.field}>
                  <span>Telefone</span>
                  <input
                    className={styles.input}
                    value={me?.phone ?? ""}
                    onChange={(e) => update({ phone: e.target.value })}
                    placeholder="+31 6 1234 5678"
                  />
                </label>

                <label className={styles.field}>
                  <span>Cidade</span>
                  <input
                    className={styles.input}
                    value={me?.city ?? ""}
                    onChange={(e) => update({ city: e.target.value })}
                    placeholder="Amsterdã"
                  />
                </label>

                <label className={styles.field}>
                  <span>País</span>
                  <input
                    className={styles.input}
                    value={me?.country ?? ""}
                    onChange={(e) => update({ country: e.target.value })}
                    placeholder="Holanda"
                  />
                </label>
              </div>

              <div className={styles.actionsRow}>
                <button type="button" className="btn-secondary" onClick={pauseOffers}>
                  Pausar ofertas
                </button>
                <button type="submit" className="btn-primary" disabled={saving}>
                  {saving ? "Salvando..." : "Salvar alterações"}
                </button>
              </div>
            </form>
          </div>
        </section>

        {/* Card: Preferências e notificações */}
        <section className={styles.card}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Notificações & Preferências</h2>
          </div>

          <div className={styles.prefsGrid}>
            <label className={styles.toggle}>
              <input
                type="checkbox"
                checked={!!me?.prefs?.notifyMessages}
                onChange={(e) => updatePrefs({ notifyMessages: e.target.checked })}
              />
              <span>Alertas de novas mensagens</span>
            </label>

            <label className={styles.toggle}>
              <input
                type="checkbox"
                checked={!!me?.prefs?.notifyTrades}
                onChange={(e) => updatePrefs({ notifyTrades: e.target.checked })}
              />
              <span>Alertas de propostas de troca</span>
            </label>

            <label className={styles.toggle}>
              <input
                type="checkbox"
                checked={!!me?.prefs?.newsletter}
                onChange={(e) => updatePrefs({ newsletter: e.target.checked })}
              />
              <span>Receber novidades do ReUse!</span>
            </label>
          </div>
        </section>

        {/* Card: Segurança */}
        <section className={styles.card}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Segurança</h2>
          </div>

          <form className={styles.securityForm} onSubmit={changePassword}>
            <p className={styles.muted}>
              Recomendado alterar a senha periodicamente para manter sua conta segura.
            </p>
            <div className={styles.actionsRow}>
              <button type="submit" className="btn-primary">Redefinir senha</button>
            </div>
          </form>
        </section>

        {/* Card: Zona de risco */}
        <section className={`${styles.card} ${styles.danger}`}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Zona de risco</h2>
          </div>
          <div className={styles.dangerRow}>
            <div>
              <strong>Excluir conta</strong>
              <p className={styles.muted}>Isto removerá seus dados locais e desconectará sua sessão.</p>
            </div>
            <button className={styles.deleteBtn} onClick={deleteAccount}>Excluir conta</button>
          </div>
        </section>
      </main>
    </div>
  );
}

