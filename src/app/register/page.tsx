// src/app/register/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import styles from "./register.module.css";

export default function RegisterPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (password !== confirmPassword) {
      setMessage("As senhas não conferem.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.error || "Erro ao cadastrar usuário.");
      } else {
        // ✅ Cadastro bem-sucedido → redireciona direto para o dashboard
        router.push("/dashboard");
      }
    } catch (error) {
      setMessage("Erro no servidor. Tente novamente mais tarde.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>Criar Conta</h1>
        <p className={styles.subtitle}>
          Junte-se à comunidade ReUse! e faça parte da mudança.
        </p>

        <form className={styles.form} onSubmit={handleSubmit}>
          {/* Nome */}
          <div className={styles.inputGroup}>
            <label htmlFor="name">Nome completo</label>
            <input
              id="name"
              type="text"
              placeholder="Digite seu nome"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          {/* Email */}
          <div className={styles.inputGroup}>
            <label htmlFor="email">E-mail</label>
            <input
              id="email"
              type="email"
              placeholder="seuemail@exemplo.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* Senha */}
          <div className={styles.inputGroup}>
            <label htmlFor="password">Senha</label>
            <input
              id="password"
              type="password"
              placeholder="Digite sua senha"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {/* Confirmar Senha */}
          <div className={styles.inputGroup}>
            <label htmlFor="confirm-password">Confirmar senha</label>
            <input
              id="confirm-password"
              type="password"
              placeholder="Repita sua senha"
              required
              minLength={6}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          {/* Botão */}
          <button type="submit" className={styles.primaryBtn} disabled={loading}>
            {loading ? "Cadastrando..." : "Criar conta"}
          </button>
        </form>

        {/* Feedback */}
        {message && <p className={styles.message}>{message}</p>}

        <p className={styles.loginText}>
          Já tem conta?{" "}
          <Link href="/login" className={styles.link}>
            Entrar
          </Link>
        </p>
      </div>
    </div>
  );
}


