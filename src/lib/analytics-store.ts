import fs from "fs";
import { ANALYTICS_FILE, CMS_DIR } from "@/lib/cms-paths";

export type AnalyticsData = {
  pages: { home: number; blog: number };
  posts: Record<string, number>;
  updatedAt: string;
};

function defaultData(): AnalyticsData {
  return {
    pages: { home: 0, blog: 0 },
    posts: {},
    updatedAt: "",
  };
}

export function readAnalyticsSync(): AnalyticsData {
  try {
    const raw = fs.readFileSync(ANALYTICS_FILE, "utf-8");
    const d = JSON.parse(raw) as AnalyticsData;
    return {
      pages: { home: d.pages?.home ?? 0, blog: d.pages?.blog ?? 0 },
      posts: typeof d.posts === "object" && d.posts ? d.posts : {},
      updatedAt: d.updatedAt ?? "",
    };
  } catch {
    return defaultData();
  }
}

function ensureDir() {
  if (!fs.existsSync(CMS_DIR)) {
    fs.mkdirSync(CMS_DIR, { recursive: true });
  }
}

export function writeAnalyticsSync(data: AnalyticsData) {
  ensureDir();
  data.updatedAt = new Date().toISOString();
  fs.writeFileSync(ANALYTICS_FILE, JSON.stringify(data, null, 2), "utf-8");
}

export function incrementPageView(page: "home" | "blog") {
  const data = readAnalyticsSync();
  data.pages[page] = (data.pages[page] ?? 0) + 1;
  writeAnalyticsSync(data);
}

export function incrementPostView(slug: string) {
  const data = readAnalyticsSync();
  data.posts[slug] = (data.posts[slug] ?? 0) + 1;
  writeAnalyticsSync(data);
}

/** Aligner les clés de vues sur la liste d’articles (nouveaux slugs à 0, anciens supprimés). */
export function syncPostKeysFromBlog(posts: { slug: string }[]) {
  const data = readAnalyticsSync();
  const slugs = new Set(posts.map((p) => p.slug));
  for (const s of slugs) {
    if (data.posts[s] === undefined) data.posts[s] = 0;
  }
  for (const key of Object.keys(data.posts)) {
    if (!slugs.has(key)) delete data.posts[key];
  }
  writeAnalyticsSync(data);
}
