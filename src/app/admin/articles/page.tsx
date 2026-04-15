import Link from "next/link";
import { readPostsSync } from "@/lib/blog-store";
import { readAnalyticsSync } from "@/lib/analytics-store";
import DeleteArticleButton from "./DeleteArticleButton";

export default function AdminArticlesPage() {
  const posts = [...readPostsSync()].sort((a, b) =>
    b.publishedAt.localeCompare(a.publishedAt)
  );
  const analytics = readAnalyticsSync();

  return (
    <>
      <h1 className="admin-page-title">Articles</h1>
      <p className="admin-page-desc">
        Liste des articles du blog. Modifiez, supprimez ou créez du contenu.
      </p>
      <p style={{ marginBottom: "1rem" }}>
        <Link href="/admin/articles/nouveau" className="admin-btn admin-btn--primary">
          + Nouvel article
        </Link>
      </p>

      <div className="admin-card admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Titre</th>
              <th>Catégorie</th>
              <th>Date</th>
              <th>Vues</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {posts.map((p) => (
              <tr key={p.slug}>
                <td>
                  <Link href={`/blog/${p.slug}`} target="_blank" rel="noopener noreferrer">
                    {p.title}
                  </Link>
                </td>
                <td>{p.category}</td>
                <td>{p.date}</td>
                <td>{analytics.posts[p.slug] ?? 0}</td>
                <td>
                  <Link
                    href={`/admin/articles/${encodeURIComponent(p.slug)}/modifier`}
                    className="admin-btn admin-btn--secondary"
                    style={{ padding: "0.35rem 0.75rem", fontSize: "0.8rem" }}
                  >
                    Modifier
                  </Link>{" "}
                  <DeleteArticleButton slug={p.slug} disabled={posts.length <= 1} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
