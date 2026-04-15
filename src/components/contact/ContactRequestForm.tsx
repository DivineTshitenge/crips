"use client";

import { useState } from "react";

type FormState = {
  fullName: string;
  email: string;
  phone: string;
  message: string;
};

const initialState: FormState = {
  fullName: "",
  email: "",
  phone: "",
  message: "",
};

export default function ContactRequestForm() {
  const [form, setForm] = useState<FormState>(initialState);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ type: "ok" | "err"; text: string } | null>(
    null
  );

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setMsg(null);
    try {
      const res = await fetch("/api/contact/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) throw new Error(data.error ?? "Impossible d'envoyer la demande.");
      setMsg({
        type: "ok",
        text: "Votre demande de rendez-vous a été envoyée. Nous vous contacterons rapidement.",
      });
      setForm(initialState);
    } catch (err) {
      setMsg({
        type: "err",
        text: err instanceof Error ? err.message : "Erreur inattendue.",
      });
    } finally {
      setBusy(false);
    }
  }

  return (
    <form className="contact-form" onSubmit={onSubmit}>
      {msg ? (
        <p
          style={{
            marginBottom: "0.75rem",
            color: msg.type === "ok" ? "#d9f5d0" : "#ffe0e0",
            fontSize: "0.9rem",
          }}
        >
          {msg.text}
        </p>
      ) : null}

      <label>
        Nom complet*
        <input
          type="text"
          placeholder="Votre nom complet"
          value={form.fullName}
          onChange={(e) => setForm((f) => ({ ...f, fullName: e.target.value }))}
          required
        />
      </label>
      <label>
        E-mail*
        <input
          type="email"
          placeholder="Votre adresse e-mail"
          value={form.email}
          onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
          required
        />
      </label>
      <label>
        Téléphone
        <input
          type="tel"
          placeholder="Votre numéro"
          value={form.phone}
          onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
        />
      </label>
      <label>
        Message*
        <textarea
          placeholder="Votre message"
          rows={4}
          value={form.message}
          onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
          required
        />
      </label>
      <button type="submit" disabled={busy}>
        {busy ? "Envoi..." : "Envoyer"}
      </button>
    </form>
  );
}
