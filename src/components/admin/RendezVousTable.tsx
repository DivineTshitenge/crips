"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

export type RendezVousRow = {
  id: string;
  full_name: string;
  email: string;
  phone: string | null;
  message: string;
  preferred_contact: string | null;
  status: string;
  created_at: string;
};

const STATUS_OPTIONS = [
  { value: "new", label: "Nouveau" },
  { value: "in_progress", label: "En cours" },
  { value: "booked", label: "Réservé" },
  { value: "closed", label: "Clôturé" },
  { value: "spam", label: "Spam" },
] as const;

export default function RendezVousTable({ rows }: { rows: RendezVousRow[] }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);
  const [msg, setMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const fromTs = fromDate ? new Date(fromDate).getTime() : null;
    const toTs = toDate ? new Date(`${toDate}T23:59:59`).getTime() : null;

    return rows.filter((r) => {
      if (statusFilter !== "all" && r.status !== statusFilter) return false;
      const createdTs = new Date(r.created_at).getTime();
      if (fromTs && createdTs < fromTs) return false;
      if (toTs && createdTs > toTs) return false;
      if (!q) return true;
      return (
        r.full_name.toLowerCase().includes(q) ||
        r.email.toLowerCase().includes(q) ||
        (r.phone ?? "").toLowerCase().includes(q)
      );
    });
  }, [rows, query, statusFilter, fromDate, toDate]);

  async function updateStatus(id: string, status: string) {
    setBusyId(id);
    setMsg(null);
    try {
      const res = await fetch(`/api/admin/rendez-vous/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) throw new Error(data.error ?? "Mise à jour refusée");
      setMsg({ type: "ok", text: "Statut mis à jour." });
      router.refresh();
    } catch (e) {
      setMsg({ type: "err", text: e instanceof Error ? e.message : "Erreur" });
    } finally {
      setBusyId(null);
    }
  }

  return (
    <>
      <div className="admin-card">
        {msg ? (
          <div className={`admin-msg ${msg.type === "ok" ? "admin-msg--ok" : "admin-msg--err"}`}>
            {msg.text}
          </div>
        ) : null}
        <div className="admin-form-grid admin-form-grid--2">
          <div className="admin-form-field">
            <label htmlFor="rv-search">Recherche (nom, email, téléphone)</label>
            <input
              id="rv-search"
              placeholder="Ex: benmak, gmail.com, 081..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <div className="admin-form-field">
            <label htmlFor="rv-status">Filtrer par statut</label>
            <select
              id="rv-status"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">Tous</option>
              {STATUS_OPTIONS.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>
          <div className="admin-form-field">
            <label htmlFor="rv-from">Du</label>
            <input id="rv-from" type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
          </div>
          <div className="admin-form-field">
            <label htmlFor="rv-to">Au</label>
            <input id="rv-to" type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} />
          </div>
        </div>
      </div>

      <div className="admin-card admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Nom</th>
              <th>Email</th>
              <th>Téléphone</th>
              <th>Contact préféré</th>
              <th>Statut</th>
              <th>Message</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ color: "#4e655c" }}>
                  Aucune demande trouvée avec ces filtres.
                </td>
              </tr>
            ) : (
              filtered.map((r) => (
                <tr key={r.id}>
                  <td>{new Date(r.created_at).toLocaleString("fr-FR")}</td>
                  <td>{r.full_name}</td>
                  <td>{r.email}</td>
                  <td>{r.phone || "-"}</td>
                  <td>{r.preferred_contact || "-"}</td>
                  <td>
                    <select
                      value={r.status}
                      disabled={busyId === r.id}
                      onChange={(e) => void updateStatus(r.id, e.target.value)}
                      style={{ minWidth: "140px" }}
                    >
                      {STATUS_OPTIONS.map((s) => (
                        <option key={s.value} value={s.value}>
                          {s.label}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td style={{ maxWidth: "320px", whiteSpace: "pre-wrap" }}>{r.message}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
