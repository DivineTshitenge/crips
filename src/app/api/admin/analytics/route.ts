import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { COOKIE_NAME, verifyAdminToken } from "@/lib/admin-token";
import { readAnalyticsSync } from "@/lib/analytics-store";
import { readPostsSync } from "@/lib/blog-store";

export async function GET() {
  const jar = await cookies();
  if (!(await verifyAdminToken(jar.get(COOKIE_NAME)?.value))) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }
  const analytics = readAnalyticsSync();
  const posts = readPostsSync();
  return NextResponse.json({ analytics, postCount: posts.length });
}
