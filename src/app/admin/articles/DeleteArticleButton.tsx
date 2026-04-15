"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function DeleteArticleButton({
  slug,
  disabled,
}: {
  slug: string;
  disabled?: boolean;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function onDelete() {
    if (!confirm(`Supprimer définitivement « ${slug} » ?`)) return;
    setBusy(true);
    try {
      const res = await fetch(`/api/admin/posts/${encodeURIComponent(slug)}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const d = (await res.json()) as { error?: string };
        alert(d.error ?? "Erreur");
        return;
      }
      router.refresh();
    } finally {
      setBusy(false);
    }
  }

  return (
    <button
      type="button"
      className="admin-btn admin-btn--danger"
      style={{ padding: "0.35rem 0.75rem", fontSize: "0.8rem", marginLeft: "0.35rem" }}
      disabled={disabled || busy}
      onClick={onDelete}
    >
      {busy ? "…" : "Supprimer"}
    </button>
  );
}
