import MediasPageClient from "./MediasPageClient";

export default function AdminMediasPage() {
  return (
    <>
      <h1 className="admin-page-title">Médiathèque</h1>
      <p className="admin-page-desc">
        Images hébergées sur le serveur. Copiez l’URL dans un article (champ image ou avatar).
      </p>
      <div className="admin-card">
        <MediasPageClient />
      </div>
    </>
  );
}
