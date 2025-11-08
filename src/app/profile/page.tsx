// src/app/profile/page.tsx
"use client";

export default function ProfilePage() {
  let user: any = null;
  try { user = JSON.parse(localStorage.getItem("user") || "null"); } catch {}

  return (
    <div style={{ maxWidth: 640, margin: "0 auto", padding: 16, background: "#fff", borderRadius: 12, border: "1px solid #eee" }}>
      <h1>Perfil</h1>
      {!user ? (
        <p style={{ marginTop: 8 }}>Você não está autenticado.</p>
      ) : (
        <div style={{ marginTop: 12, display: "grid", gap: 8 }}>
          <div><strong>Nome:</strong> {user.name}</div>
          <div><strong>E-mail:</strong> {user.email}</div>
        </div>
      )}
    </div>
  );
}
