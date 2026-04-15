"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";

export default function AdminLoginClient() {
  const search = useSearchParams();
  const from = search.get("from") || "/admin";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) {
        setError(data.error ?? "Connexion refusée");
        return;
      }
      window.location.href = from.startsWith("/admin") ? from : "/admin";
    } catch {
      setError("Erreur réseau");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="admin-login-card">
      <img
        src="/logo-crips.png"
        alt="Logo CRIPS"
        style={{
          width: "64px",
          height: "64px",
          borderRadius: "50%",
          objectFit: "cover",
          border: "1px solid #d7e3d1",
          marginBottom: "0.7rem",
          background: "#fff",
        }}
      />
      <h1>Connexion administration</h1>
      <p>Accès réservé aux gestionnaires du site CRIPS.</p>
      {error && <div className="admin-login-error">{error}</div>}
      <form onSubmit={onSubmit}>
        <label htmlFor="admin-email">Email admin (Supabase Auth)</label>
        <input
          id="admin-email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <label htmlFor="admin-password">Mot de passe</label>
        <input
          id="admin-password"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" disabled={busy}>
          {busy ? "Connexion…" : "Se connecter"}
        </button>
      </form>
    </div>
  );
}
