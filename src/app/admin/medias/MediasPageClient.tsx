"use client";

import { useCallback, useEffect, useState } from "react";

type ListRes = { files?: string[]; urls?: string[]; error?: string };

export default function MediasPageClient() {
  const [urls, setUrls] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);
  const [deletingUrl, setDeletingUrl] = useState<string | null>(null);
  const [msg, setMsg] = useState<string | null>(null);

  const load = useCallback(async () => {
    const res = await fetch("/api/admin/uploads");
    const data = (await res.json()) as ListRes;
    if (data.urls) setUrls(data.urls);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function onUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setBusy(true);
    setMsg(null);
    try {
      const fd = new FormData();
      fd.set("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      const data = (await res.json()) as { url?: string; error?: string };
      if (!res.ok) throw new Error(data.error ?? "Échec");
      setMsg(`Ajouté : ${data.url}`);
      await load();
    } catch (err) {
      setMsg(err instanceof Error ? err.message : "Erreur");
    } finally {
      setBusy(false);
      e.target.value = "";
    }
  }

  async function onDelete(url: string) {
    const filename = url.split("/").pop();
    if (!filename) return;

    const ok = window.confirm(`Supprimer l'image "${filename}" ?`);
    if (!ok) return;

    setDeletingUrl(url);
    setMsg(null);
    try {
      const res = await fetch(`/api/admin/uploads?filename=${encodeURIComponent(filename)}`, {
        method: "DELETE",
      });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) throw new Error(data.error ?? "Suppression impossible");
      setMsg(`Supprimé : ${filename}`);
      await load();
    } catch (err) {
      setMsg(err instanceof Error ? err.message : "Erreur");
    } finally {
      setDeletingUrl(null);
    }
  }

  return (
    <>
      {msg && (
        <div className={msg.startsWith("Ajouté") ? "admin-msg admin-msg--ok" : "admin-msg admin-msg--err"}>
          {msg}
        </div>
      )}
      <div className="admin-upload-zone">
        <p style={{ margin: "0 0 0.75rem", color: "#164a41", fontWeight: 600 }}>
          Envoyer une image
        </p>
        <input type="file" accept="image/*" disabled={busy} onChange={onUpload} />
        <p style={{ margin: "0.75rem 0 0", fontSize: "0.85rem", color: "#4e655c" }}>
          JPEG, PNG, WebP, GIF, SVG — max 5 Mo. Fichiers dans{" "}
          <code>public/uploads/cms/</code>.
        </p>
      </div>

      <h2 style={{ fontSize: "1.05rem", color: "#164a41", margin: "1.25rem 0 0.75rem" }}>
        Fichiers disponibles
      </h2>
      <div className="admin-media-grid">
        {urls.length === 0 && (
          <p style={{ color: "#4e655c", fontSize: "0.9rem" }}>Aucun fichier pour l’instant.</p>
        )}
        {urls.map((url) => (
          <figure key={url} className="admin-media-item">
            <img src={url} alt="" />
            <figcaption>
              <a href={url} target="_blank" rel="noopener noreferrer">
                {url.replace(/^.*\//, "")}
              </a>
              <button
                type="button"
                className="admin-media-delete"
                disabled={deletingUrl === url}
                onClick={() => void onDelete(url)}
              >
                {deletingUrl === url ? "Suppression..." : "Supprimer"}
              </button>
            </figcaption>
          </figure>
        ))}
      </div>
    </>
  );
}
