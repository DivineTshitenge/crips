import fs from "fs";
import type { BlogPost } from "@/types/blog";
import { BLOG_POSTS_FILE, CMS_DIR } from "@/lib/cms-paths";

function ensureDir() {
  if (!fs.existsSync(CMS_DIR)) {
    fs.mkdirSync(CMS_DIR, { recursive: true });
  }
}

export function readPostsSync(): BlogPost[] {
  try {
    const raw = fs.readFileSync(BLOG_POSTS_FILE, "utf-8");
    const data = JSON.parse(raw) as BlogPost[];
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

export function writePostsSync(posts: BlogPost[]) {
  ensureDir();
  fs.writeFileSync(BLOG_POSTS_FILE, JSON.stringify(posts, null, 2), "utf-8");
}

export function getPostBySlugSync(slug: string): BlogPost | undefined {
  return readPostsSync().find((p) => p.slug === slug);
}

export function getFeaturedAndRestSync(): { featured: BlogPost; rest: BlogPost[] } {
  const sorted = [...readPostsSync()].sort((a, b) =>
    b.publishedAt.localeCompare(a.publishedAt)
  );
  if (sorted.length === 0) {
    throw new Error("Aucun article dans data/cms/blog-posts.json");
  }
  const [featured, ...rest] = sorted;
  return { featured, rest };
}

export function slugify(input: string): string {
  return input
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80) || "article";
}
