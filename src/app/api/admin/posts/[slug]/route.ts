import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import type { BlogPost } from "@/types/blog";
import { COOKIE_NAME, verifyAdminToken } from "@/lib/admin-token";
import { readPostsSync, slugify, writePostsSync } from "@/lib/blog-store";
import { syncPostKeysFromBlog } from "@/lib/analytics-store";

type Ctx = { params: Promise<{ slug: string }> };

async function guard() {
  const jar = await cookies();
  if (!(await verifyAdminToken(jar.get(COOKIE_NAME)?.value))) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }
  return null;
}

export async function GET(_request: Request, ctx: Ctx) {
  const deny = await guard();
  if (deny) return deny;
  const { slug } = await ctx.params;
  const post = readPostsSync().find((p) => p.slug === slug);
  if (!post) return NextResponse.json({ error: "Introuvable" }, { status: 404 });
  return NextResponse.json({ post });
}

export async function PUT(request: Request, ctx: Ctx) {
  const deny = await guard();
  if (deny) return deny;
  const { slug } = await ctx.params;
  const posts = readPostsSync();
  const idx = posts.findIndex((p) => p.slug === slug);
  if (idx === -1) return NextResponse.json({ error: "Introuvable" }, { status: 404 });

  let body: Partial<BlogPost>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "JSON invalide" }, { status: 400 });
  }

  const prev = posts[idx];
  let newSlug = prev.slug;
  if (typeof body.slug === "string" && body.slug.trim()) {
    const candidate = slugify(body.slug.trim());
    if (candidate !== prev.slug && posts.some((p) => p.slug === candidate)) {
      return NextResponse.json({ error: "Ce slug existe déjà" }, { status: 400 });
    }
    newSlug = candidate;
  }

  const updated: BlogPost = {
    slug: newSlug,
    title: typeof body.title === "string" ? body.title.trim() : prev.title,
    excerpt: typeof body.excerpt === "string" ? body.excerpt.trim() : prev.excerpt,
    image: typeof body.image === "string" ? body.image.trim() : prev.image,
    category: typeof body.category === "string" ? body.category.trim() : prev.category,
    date: typeof body.date === "string" ? body.date.trim() : prev.date,
    publishedAt:
      typeof body.publishedAt === "string" ? body.publishedAt.trim() : prev.publishedAt,
    author: typeof body.author === "string" ? body.author.trim() : prev.author,
    authorAvatar:
      typeof body.authorAvatar === "string" ? body.authorAvatar.trim() : prev.authorAvatar,
    content: typeof body.content === "string" ? body.content : prev.content ?? "",
  };

  posts[idx] = updated;
  writePostsSync(posts);
  syncPostKeysFromBlog(posts);
  return NextResponse.json({ post: updated });
}

export async function DELETE(_request: Request, ctx: Ctx) {
  const deny = await guard();
  if (deny) return deny;
  const { slug } = await ctx.params;
  const before = readPostsSync();
  if (before.length <= 1) {
    return NextResponse.json(
      { error: "Conserver au moins un article sur le blog." },
      { status: 400 }
    );
  }
  const posts = before.filter((p) => p.slug !== slug);
  if (posts.length === before.length) {
    return NextResponse.json({ error: "Introuvable" }, { status: 404 });
  }
  writePostsSync(posts);
  syncPostKeysFromBlog(posts);
  return NextResponse.json({ ok: true });
}
