import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import type { BlogPost } from "@/types/blog";
import { COOKIE_NAME, verifyAdminToken } from "@/lib/admin-token";
import { readPostsSync, slugify, writePostsSync } from "@/lib/blog-store";
import { syncPostKeysFromBlog } from "@/lib/analytics-store";

async function guard() {
  const jar = await cookies();
  if (!(await verifyAdminToken(jar.get(COOKIE_NAME)?.value))) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }
  return null;
}

function uniqueSlug(base: string, posts: BlogPost[]): string {
  let s = base;
  let n = 2;
  const taken = new Set(posts.map((p) => p.slug));
  while (taken.has(s)) {
    s = `${base}-${n}`;
    n += 1;
  }
  return s;
}

export async function GET() {
  const deny = await guard();
  if (deny) return deny;
  return NextResponse.json({ posts: readPostsSync() });
}

export async function POST(request: Request) {
  const deny = await guard();
  if (deny) return deny;

  let body: Partial<BlogPost>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "JSON invalide" }, { status: 400 });
  }

  const required = [
    "title",
    "excerpt",
    "image",
    "category",
    "date",
    "publishedAt",
    "author",
    "authorAvatar",
  ] as const;
  for (const k of required) {
    if (typeof body[k] !== "string" || !(body[k] as string).trim()) {
      return NextResponse.json({ error: `Champ requis : ${k}` }, { status: 400 });
    }
  }

  const posts = readPostsSync();
  const baseSlug = body.slug?.trim()
    ? slugify(body.slug.trim())
    : slugify((body.title as string).trim());
  const slug = uniqueSlug(baseSlug, posts);

  const post: BlogPost = {
    slug,
    title: (body.title as string).trim(),
    excerpt: (body.excerpt as string).trim(),
    image: (body.image as string).trim(),
    category: (body.category as string).trim(),
    date: (body.date as string).trim(),
    publishedAt: (body.publishedAt as string).trim(),
    author: (body.author as string).trim(),
    authorAvatar: (body.authorAvatar as string).trim(),
    content: typeof body.content === "string" ? body.content : "",
  };

  posts.push(post);
  writePostsSync(posts);
  syncPostKeysFromBlog(posts);
  return NextResponse.json({ post }, { status: 201 });
}
