import fs from "fs";
import path from "path";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { COOKIE_NAME, verifyAdminToken } from "@/lib/admin-token";
import { UPLOADS_DIR } from "@/lib/cms-paths";

export const runtime = "nodejs";

export async function GET() {
  const jar = await cookies();
  if (!(await verifyAdminToken(jar.get(COOKIE_NAME)?.value))) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  if (!fs.existsSync(UPLOADS_DIR)) {
    return NextResponse.json({ files: [] as string[] });
  }

  const files = fs
    .readdirSync(UPLOADS_DIR)
    .filter((f) => !f.startsWith("."))
    .sort((a, b) => b.localeCompare(a));

  const urls = files.map((f) => `/uploads/cms/${f}`);
  return NextResponse.json({ files, urls });
}

export async function DELETE(request: Request) {
  const jar = await cookies();
  if (!(await verifyAdminToken(jar.get(COOKIE_NAME)?.value))) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const url = new URL(request.url);
  const filename = url.searchParams.get("filename")?.trim();

  if (!filename) {
    return NextResponse.json({ error: "Nom de fichier manquant" }, { status: 400 });
  }

  const safeName = path.basename(filename);
  if (safeName !== filename) {
    return NextResponse.json({ error: "Nom de fichier invalide" }, { status: 400 });
  }

  const filePath = path.join(UPLOADS_DIR, safeName);
  if (!fs.existsSync(filePath)) {
    return NextResponse.json({ error: "Image introuvable" }, { status: 404 });
  }

  fs.unlinkSync(filePath);
  return NextResponse.json({ ok: true });
}
