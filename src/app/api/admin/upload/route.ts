import { randomBytes } from "crypto";
import fs from "fs";
import path from "path";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { COOKIE_NAME, verifyAdminToken } from "@/lib/admin-token";
import { UPLOADS_DIR } from "@/lib/cms-paths";

export const runtime = "nodejs";

const MAX_BYTES = 5 * 1024 * 1024;
const ALLOWED = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/svg+xml",
]);

async function guard() {
  const jar = await cookies();
  if (!(await verifyAdminToken(jar.get(COOKIE_NAME)?.value))) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }
  return null;
}

export async function POST(request: Request) {
  const deny = await guard();
  if (deny) return deny;

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.json({ error: "Formulaire invalide" }, { status: 400 });
  }

  const file = form.get("file");
  if (!file || !(file instanceof File)) {
    return NextResponse.json({ error: "Fichier « file » manquant" }, { status: 400 });
  }

  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: "Fichier trop volumineux (max 5 Mo)" }, { status: 400 });
  }

  const mime = file.type || "application/octet-stream";
  if (!ALLOWED.has(mime)) {
    return NextResponse.json({ error: "Type non autorisé" }, { status: 400 });
  }

  const orig = file.name || "upload";
  const ext = path.extname(orig).toLowerCase() || (mime.includes("png") ? ".png" : ".jpg");
  const base = `${Date.now()}-${randomBytes(6).toString("hex")}`;
  const filename = `${base}${ext}`;

  if (!fs.existsSync(UPLOADS_DIR)) {
    fs.mkdirSync(UPLOADS_DIR, { recursive: true });
  }

  const buf = Buffer.from(await file.arrayBuffer());
  const dest = path.join(UPLOADS_DIR, filename);
  fs.writeFileSync(dest, buf);

  const url = `/uploads/cms/${filename}`;
  return NextResponse.json({ url, filename });
}
