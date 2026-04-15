import { NextResponse } from "next/server";
import {
  incrementPageView,
  incrementPostView,
} from "@/lib/analytics-store";

export const runtime = "nodejs";

type Body = { target?: string; slug?: string };

export async function POST(request: Request) {
  let body: Body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "JSON invalide" }, { status: 400 });
  }

  const target = body.target;
  if (target === "home") {
    incrementPageView("home");
    return NextResponse.json({ ok: true });
  }
  if (target === "blog") {
    incrementPageView("blog");
    return NextResponse.json({ ok: true });
  }
  if (target === "post" && typeof body.slug === "string" && body.slug.trim()) {
    incrementPostView(body.slug.trim());
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ error: "Paramètres invalides" }, { status: 400 });
}
