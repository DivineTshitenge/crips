import { readAnalyticsSync } from "@/lib/analytics-store";
import { readPostsSync } from "@/lib/blog-store";

export default function AdminStatistiquesPage() {
  const analytics = readAnalyticsSync();
  const posts = readPostsSync();
  const bySlug = posts.map((p) => ({
    slug: p.slug,
    title: p.title,
    views: analytics.posts[p.slug] ?? 0,
  }));
  bySlug.sort((a, b) => b.views - a.views);

  return (
    <>
      <h1 className="admin-page-title">Statistiques</h1>
      <p className="admin-page-desc">
        Consultations enregistrées côté serveur (incrément à chaque visite des pages concernées).
      </p>

      <div className="admin-card">
        <h2 style={{ fontSize: "1.05rem", color: "#164a41", margin: "0 0 1rem" }}>
          Pages globales
        </h2>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Page</th>
              <th>Vues</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Accueil</td>
              <td>{analytics.pages.home}</td>
            </tr>
            <tr>
              <td>Liste blog</td>
              <td>{analytics.pages.blog}</td>
            </tr>
          </tbody>
        </table>
        {analytics.updatedAt && (
          <p style={{ fontSize: "0.82rem", color: "#4e655c", marginTop: "0.75rem" }}>
            Dernière mise à jour : {new Date(analytics.updatedAt).toLocaleString("fr-FR")}
          </p>
        )}
      </div>

      <div className="admin-card admin-table-wrap">
        <h2 style={{ fontSize: "1.05rem", color: "#164a41", margin: "0 0 1rem" }}>
          Par article
        </h2>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Article</th>
              <th>Slug</th>
              <th>Vues</th>
            </tr>
          </thead>
          <tbody>
            {bySlug.map((row) => (
              <tr key={row.slug}>
                <td>{row.title}</td>
                <td>
                  <code style={{ fontSize: "0.82rem" }}>{row.slug}</code>
                </td>
                <td>{row.views}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
