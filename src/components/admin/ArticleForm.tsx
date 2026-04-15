"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { BlogPost } from "@/types/blog";

const defaultAvatar =
  "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=120&h=120&fit=crop";

type Props =
  | { mode: "create"; initial?: undefined }
  | { mode: "edit"; initial: BlogPost };

export default function ArticleForm(props: Props) {
  const router = useRouter();
  const init = props.mode === "edit" ? props.initial : null;

  const [slug, setSlug] = useState(init?.slug ?? "");
  const [title, setTitle] = useState(init?.title ?? "");
  const [excerpt, setExcerpt] = useState(init?.excerpt ?? "");
  const [image, setImage] = useState(init?.image ?? "");
  const [category, setCategory] = useState(init?.category ?? "");
  const [date, setDate] = useState(init?.date ?? "");
  const [publishedAt, setPublishedAt] = useState(
    init?.publishedAt ?? new Date().toISOString().slice(0, 10)
  );
  const [author, setAuthor] = useState(init?.author ?? "Équipe CRIPS");
  const [authorAvatar, setAuthorAvatar] = useState(init?.authorAvatar ?? defaultAvatar);
  const [content, setContent] = useState(init?.content ?? "");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  async function uploadFile(file: File, target: "image" | "authorAvatar") {
    const fd = new FormData();
    fd.set("file", file);
    const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
    const data = (await res.json()) as { url?: string; error?: string };
    if (!res.ok) throw new Error(data.error ?? "Échec upload");
    if (!data.url) return;
    if (target === "image") setImage(data.url);
    if (target === "authorAvatar") setAuthorAvatar(data.url);
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setMsg(null);
    try {
      if (props.mode === "create") {
        const res = await fetch("/api/admin/posts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            slug: slug.trim() || undefined,
            title,
            excerpt,
            image,
            category,
            date,
            publishedAt,
            author,
            authorAvatar,
            content,
          }),
        });
        const data = (await res.json()) as { error?: string; post?: BlogPost };
        if (!res.ok) throw new Error(data.error ?? "Erreur");
        setMsg({ type: "ok", text: "Article publié." });
        router.push("/admin/articles");
        router.refresh();
        return;
      }

      if (props.mode !== "edit") return;
      const origSlug = props.initial.slug;
      const res = await fetch(`/api/admin/posts/${encodeURIComponent(origSlug)}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug: slug.trim() || origSlug,
          title,
          excerpt,
          image,
          category,
          date,
          publishedAt,
          author,
          authorAvatar,
          content,
        }),
      });
      const data = (await res.json()) as { error?: string; post?: BlogPost };
      if (!res.ok) throw new Error(data.error ?? "Erreur");
      setMsg({ type: "ok", text: "Article mis à jour." });
      router.push("/admin/articles");
      router.refresh();
    } catch (err) {
      setMsg({
        type: "err",
        text: err instanceof Error ? err.message : "Erreur inconnue",
      });
    } finally {
      setBusy(false);
    }
  }

  return (
    <form className="admin-card" onSubmit={onSubmit}>
      {msg && (
        <div className={`admin-msg ${msg.type === "ok" ? "admin-msg--ok" : "admin-msg--err"}`}>
          {msg.text}
        </div>
      )}

      <div className="admin-form-grid admin-form-grid--2">
        <div className="admin-form-field">
          <label htmlFor="title">Titre *</label>
          <input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div className="admin-form-field">
          <label htmlFor="slug">Slug (URL)</label>
          <input
            id="slug"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            placeholder="auto depuis le titre si vide"
          />
        </div>
      </div>

      <div className="admin-form-field" style={{ marginTop: "1rem" }}>
        <label htmlFor="excerpt">Chapô / extrait *</label>
        <textarea id="excerpt" value={excerpt} onChange={(e) => setExcerpt(e.target.value)} required />
      </div>

      <div className="admin-form-field" style={{ marginTop: "1rem" }}>
        <label htmlFor="image">URL image principale *</label>
        <input
          id="image"
          value={image}
          onChange={(e) => setImage(e.target.value)}
          required
        />
        <div style={{ marginTop: "0.5rem" }}>
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) void uploadFile(f, "image").catch((err) => {
                setMsg({ type: "err", text: err instanceof Error ? err.message : "Upload" });
              });
            }}
          />
          <span style={{ fontSize: "0.8rem", color: "#4e655c", marginLeft: "0.5rem" }}>
            Envoyer une image (max 5 Mo) — l’URL sera remplie automatiquement.
          </span>
        </div>
      </div>

      <div className="admin-form-grid admin-form-grid--2" style={{ marginTop: "1rem" }}>
        <div className="admin-form-field">
          <label htmlFor="category">Catégorie *</label>
          <input
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          />
        </div>
        <div className="admin-form-field">
          <label htmlFor="date">Date affichée *</label>
          <input id="date" value={date} onChange={(e) => setDate(e.target.value)} required />
        </div>
        <div className="admin-form-field">
          <label htmlFor="publishedAt">Date ISO (tri) *</label>
          <input
            id="publishedAt"
            type="date"
            value={publishedAt.slice(0, 10)}
            onChange={(e) => setPublishedAt(e.target.value)}
            required
          />
        </div>
      </div>

      <div className="admin-form-grid admin-form-grid--2" style={{ marginTop: "1rem" }}>
        <div className="admin-form-field">
          <label htmlFor="author">Auteur *</label>
          <input id="author" value={author} onChange={(e) => setAuthor(e.target.value)} required />
        </div>
        <div className="admin-form-field">
          <label htmlFor="authorAvatar">URL avatar auteur *</label>
          <input
            id="authorAvatar"
            value={authorAvatar}
            onChange={(e) => setAuthorAvatar(e.target.value)}
            required
          />
          <div style={{ marginTop: "0.5rem", display: "flex", alignItems: "center", gap: "0.6rem" }}>
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) void uploadFile(f, "authorAvatar").catch((err) => {
                  setMsg({ type: "err", text: err instanceof Error ? err.message : "Upload avatar" });
                });
              }}
            />
            {authorAvatar ? (
              <img
                src={authorAvatar}
                alt="Aperçu avatar auteur"
                style={{
                  width: "38px",
                  height: "38px",
                  borderRadius: "999px",
                  objectFit: "cover",
                  border: "1px solid #d7e3d1",
                }}
              />
            ) : null}
          </div>
          <span style={{ fontSize: "0.8rem", color: "#4e655c" }}>
            Tu peux coller une URL ou téléverser une photo d’avatar.
          </span>
        </div>
      </div>

      <div className="admin-form-field" style={{ marginTop: "1rem" }}>
        <label htmlFor="content">Corps de l’article (paragraphes séparés par une ligne vide)</label>
        <textarea
          id="content"
          className="admin-textarea-lg"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
      </div>

      <div className="admin-form-actions">
        <button type="submit" className="admin-btn admin-btn--primary" disabled={busy}>
          {busy ? "Enregistrement…" : props.mode === "create" ? "Publier" : "Enregistrer"}
        </button>
        <button
          type="button"
          className="admin-btn admin-btn--secondary"
          onClick={() => router.push("/admin/articles")}
        >
          Annuler
        </button>
      </div>
    </form>
  );
}
