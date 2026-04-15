import Link from "next/link";
import type { Metadata } from "next";
import { Lora } from "next/font/google";
import { getFeaturedAndRestPosts } from "@/data/blog-posts";
import { BlogListViewTracker } from "@/components/analytics/ViewTrackers";

export const dynamic = "force-dynamic";

const lora = Lora({
  subsets: ["latin"],
  variable: "--font-blog-serif",
  weight: ["500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Blog psychologie Kinshasa",
  description:
    "Articles du CRIPS sur la psychologie clinique, la santé mentale, le bien-être émotionnel et l'accompagnement thérapeutique à Kinshasa.",
  keywords: [
    "blog psychologie kinshasa",
    "articles santé mentale kinshasa",
    "conseils psychologue kinshasa",
    "bien-être émotionnel rdc",
    "thérapie et accompagnement kinshasa",
  ],
  alternates: {
    canonical: "/blog",
  },
  openGraph: {
    title: "Blog psychologie Kinshasa | CRIPS",
    description:
      "Repères, conseils et analyses sur la santé mentale à Kinshasa par le CRIPS.",
    url: "/blog",
    type: "website",
    images: [
      {
        url: "/logo-crips.png",
        width: 512,
        height: 512,
        alt: "Blog CRIPS Kinshasa",
      },
    ],
  },
};

export default function BlogPage() {
  const { featured, rest } = getFeaturedAndRestPosts();

  return (
    <main className={`blog-page ${lora.variable}`}>
      <BlogListViewTracker />
      <div className="blog-page-inner container">
        <header className="blog-page-header">
          <div>
            <p className="blog-page-kicker">CRIPS</p>
            <h1 className="blog-page-title">Revue CRIPS</h1>
            <p className="blog-page-intro">
              Analyses, perspectives et contenus de référence pour une approche
              exigeante de la santé mentale et de l&apos;accompagnement psychologique.
            </p>
          </div>
        </header>

        <section className="blog-featured" aria-labelledby="blog-featured-heading">
          <h2 id="blog-featured-heading" className="blog-featured-label">
            Dernière publication
          </h2>
          <article className="blog-featured-card">
            <Link
              href={`/blog/${featured.slug}`}
              className="blog-featured__media"
            >
              <img
                src={featured.image}
                alt={featured.title}
                className="blog-featured__img"
                width={960}
                height={640}
                loading="eager"
              />
            </Link>
            <div className="blog-featured__body">
              <Link
                href={`/blog/${featured.slug}`}
                className="blog-featured__title"
              >
                {featured.title}
              </Link>
              <p className="blog-featured__excerpt">{featured.excerpt}</p>
              <div className="blog-card__meta blog-featured__meta">
                <img
                  src={featured.authorAvatar}
                  alt={featured.author}
                  className="blog-card__avatar"
                  width={40}
                  height={40}
                />
                <span className="blog-card__pill blog-card__pill--featured">
                  {featured.category}
                </span>
                <span className="blog-card__pill blog-card__pill--featured blog-card__pill--muted">
                  {featured.date}
                </span>
              </div>
            </div>
          </article>
        </section>

        <div className="blog-grid">
          {rest.map((post) => (
            <article key={post.slug} className="blog-card">
              <Link href={`/blog/${post.slug}`} className="blog-card__media">
                <img
                  src={post.image}
                  alt={post.title}
                  className="blog-card__img"
                  loading="lazy"
                />
              </Link>
              <div className="blog-card__body">
                <Link href={`/blog/${post.slug}`} className="blog-card__title">
                  {post.title}
                </Link>
                <p className="blog-card__excerpt">{post.excerpt}</p>
                <div className="blog-card__meta">
                  <img
                    src={post.authorAvatar}
                    alt={post.author}
                    className="blog-card__avatar"
                    width={40}
                    height={40}
                  />
                  <span className="blog-card__pill">{post.category}</span>
                  <span className="blog-card__pill blog-card__pill--muted">
                    {post.date}
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}
