import { NextResponse } from "next/server";
import {
  COOKIE_NAME,
  getSessionCookieOptions,
  signAdminToken,
} from "@/lib/admin-token";
import { createSupabaseAnonClient, isAdminUser } from "@/lib/supabase-auth";

export async function POST(request: Request) {
  let body: { email?: string; password?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Corps JSON invalide." }, { status: 400 });
  }

  const email = body.email?.trim().toLowerCase();
  const password = body.password?.trim();
  if (!email || !password) {
    return NextResponse.json(
      { error: "Email et mot de passe requis." },
      { status: 400 }
    );
  }

  try {
    const supabase = createSupabaseAnonClient();
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error || !data.user) {
      return NextResponse.json(
        { error: "Identifiants Supabase invalides." },
        { status: 401 }
      );
    }

    const admin = await isAdminUser(data.user);
    if (!admin) {
      return NextResponse.json(
        { error: "Ce compte n'a pas le rôle admin." },
        { status: 403 }
      );
    }

    const token = await signAdminToken();
    const res = NextResponse.json({ ok: true });
    res.cookies.set(COOKIE_NAME, token, getSessionCookieOptions());
    return res;
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Erreur session";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
