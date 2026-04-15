import path from "path";

export const CMS_DIR = path.join(process.cwd(), "data", "cms");
export const BLOG_POSTS_FILE = path.join(CMS_DIR, "blog-posts.json");
export const ANALYTICS_FILE = path.join(CMS_DIR, "analytics.json");
export const UPLOADS_DIR = path.join(process.cwd(), "public", "uploads", "cms");
