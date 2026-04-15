import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Lora } from "next/font/google";
import { getAllBlogSlugs, getPostBySlug } from "@/data/blog-posts";
import { PostViewTracker } from "@/components/analytics/ViewTrackers";

const lora = Lora({
  subsets: ["latin"],
  variable: "--font-blog-serif",
  weight: ["500", "600", "700"],
});

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getAllBlogSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return { title: "Article | CRIPS Kinshasa" };
  return {
    title: `${post.title} | CRIPS`,
    description: post.excerpt,
    keywords: [
      "article psychologie kinshasa",
      "conseils psychologue kinshasa",
      "santé mentale kinshasa",
      post.category.toLowerCase(),
    ],
    alternates: {
      canonical: `/blog/${post.slug}`,
    },
    openGraph: {
      title: `${post.title} | CRIPS`,
      description: post.excerpt,
      url: `/blog/${post.slug}`,
      type: "article",
      images: [
        {
          url: post.image,
          alt: post.title,
        },
      ],
    },
  };
}

export default async function BlogArticlePage({ params }: Props) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const paragraphs = (post.content ?? "")
    .split(/\n\n+/)
    .map((p) => p.trim())
    .filter(Boolean);
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    image: post.image,
    author: {
      "@type": "Person",
      name: post.author,
    },
    publisher: {
      "@type": "Organization",
      name: "CRIPS Kinshasa",
      logo: {
        "@type": "ImageObject",
        url: "/logo-crips.png",
      },
    },
    datePublished: post.date,
    dateModified: post.date,
    mainEntityOfPage: `/blog/${post.slug}`,
  };

  return (
    <main className={`blog-page blog-article ${lora.variable}`}>
      <PostViewTracker slug={post.slug} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <div className="blog-page-inner container">
        <nav className="blog-article-breadcrumb" aria-label="Fil d'Ariane">
          <Link href="/blog">Blog</Link>
          <span aria-hidden="true"> / </span>
          <span className="blog-article-breadcrumb-current">{post.category}</span>
        </nav>

        <article className="blog-article-inner">
          <div className="blog-article-hero">
            <img
              src={post.image}
              alt={post.title}
              className="blog-article-hero-img"
              width={800}
              height={800}
            />
          </div>
          <header className="blog-article-header">
            <p className="blog-page-kicker">{post.category}</p>
            <h1 className="blog-article-title">{post.title}</h1>
            <div className="blog-card__meta blog-article-meta">
              <img
                src={post.authorAvatar}
                alt={post.author}
                className="blog-card__avatar"
                width={40}
                height={40}
              />
              <span className="blog-card__pill">{post.author}</span>
              <span className="blog-card__pill blog-card__pill--muted">
                {post.date}
              </span>
            </div>
            <p className="blog-article-lead">{post.excerpt}</p>
            {paragraphs.length > 0 ? (
              <div className="blog-article-content">
                {paragraphs.map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </div>
            ) : (
              <p className="blog-article-placeholder">
                Contenu détaillé à compléter depuis l&apos;administration. Pour toute question,
                contactez le CRIPS via la page d&apos;accueil.
              </p>
            )}
            <Link href="/blog" className="btn-primary blog-article-back">
              ← Tous les articles
            </Link>
          </header>
        </article>
      </div>
    </main>
  );
}
