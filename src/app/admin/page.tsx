import Link from "next/link";
import { readAnalyticsSync } from "@/lib/analytics-store";
import { readPostsSync } from "@/lib/blog-store";

export default function AdminDashboardPage() {
  const analytics = readAnalyticsSync();
  const posts = readPostsSync();
  const totalPostViews = Object.values(analytics.posts).reduce((a, b) => a + b, 0);

  return (
    <>
      <h1 className="admin-page-title">Tableau de bord</h1>
      <p className="admin-page-desc">
        Vue d’ensemble du blog et des consultations enregistrées sur ce serveur.
      </p>

      <div className="admin-stats-grid">
        <div className="admin-stat">
          <div className="admin-stat-value">{posts.length}</div>
          <div className="admin-stat-label">Articles publiés</div>
        </div>
        <div className="admin-stat">
          <div className="admin-stat-value">{analytics.pages.home}</div>
          <div className="admin-stat-label">Vues page d’accueil</div>
        </div>
        <div className="admin-stat">
          <div className="admin-stat-value">{analytics.pages.blog}</div>
          <div className="admin-stat-label">Vues liste blog</div>
        </div>
        <div className="admin-stat">
          <div className="admin-stat-value">{totalPostViews}</div>
          <div className="admin-stat-label">Vues articles (total)</div>
        </div>
      </div>

      <div className="admin-card">
        <h2 style={{ fontSize: "1.1rem", color: "#164a41", margin: "0 0 1rem" }}>
          Raccourcis
        </h2>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.65rem" }}>
          <Link href="/admin/articles/nouveau" className="admin-btn admin-btn--primary">
            Nouvel article
          </Link>
          <Link href="/admin/articles" className="admin-btn admin-btn--secondary">
            Gérer les articles
          </Link>
          <Link href="/admin/medias" className="admin-btn admin-btn--secondary">
            Médiathèque
          </Link>
          <Link href="/admin/statistiques" className="admin-btn admin-btn--secondary">
            Statistiques détaillées
          </Link>
        </div>
      </div>
    </>
  );
}
