export type { BlogPost } from "@/types/blog";
import type { BlogPost } from "@/types/blog";
import {
  getFeaturedAndRestSync,
  getPostBySlugSync,
  readPostsSync,
} from "@/lib/blog-store";

export function getBlogPosts(): BlogPost[] {
  return readPostsSync();
}

export function getPostBySlug(slug: string): BlogPost | undefined {
  return getPostBySlugSync(slug);
}

export function getFeaturedAndRestPosts(): {
  featured: BlogPost;
  rest: BlogPost[];
} {
  return getFeaturedAndRestSync();
}

/** Pour generateStaticParams : liste des slugs connus au build. */
export function getAllBlogSlugs(): string[] {
  return readPostsSync().map((p) => p.slug);
}
