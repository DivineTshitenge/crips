import ArticleForm from "@/components/admin/ArticleForm";

export default function AdminNouvelArticlePage() {
  return (
    <>
      <h1 className="admin-page-title">Nouvel article</h1>
      <p className="admin-page-desc">
        Renseignez les champs puis publiez. L’image peut être une URL externe ou un fichier
        envoyé depuis la médiathèque.
      </p>
      <ArticleForm mode="create" />
    </>
  );
}
