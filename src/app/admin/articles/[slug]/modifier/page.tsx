import { notFound } from "next/navigation";
import ArticleForm from "@/components/admin/ArticleForm";
import { getPostBySlugSync } from "@/lib/blog-store";

type Props = { params: Promise<{ slug: string }> };

export default async function AdminModifierArticlePage({ params }: Props) {
  const { slug } = await params;
  const post = getPostBySlugSync(decodeURIComponent(slug));
  if (!post) notFound();

  return (
    <>
      <h1 className="admin-page-title">Modifier l’article</h1>
      <p className="admin-page-desc">Slug actuel : {post.slug}</p>
      <ArticleForm mode="edit" initial={post} />
    </>
  );
}
