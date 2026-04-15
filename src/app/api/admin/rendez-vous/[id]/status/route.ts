import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { COOKIE_NAME, verifyAdminToken } from "@/lib/admin-token";
import { createSupabaseServiceRoleClient } from "@/lib/supabase-auth";

const ALLOWED_STATUS = new Set([
  "new",
  "in_progress",
  "booked",
  "closed",
  "spam",
]);

type Ctx = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, ctx: Ctx) {
  const jar = await cookies();
  if (!(await verifyAdminToken(jar.get(COOKIE_NAME)?.value))) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const { id } = await ctx.params;

  let body: { status?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "JSON invalide" }, { status: 400 });
  }

  const status = body.status?.trim();
  if (!status || !ALLOWED_STATUS.has(status)) {
    return NextResponse.json({ error: "Statut invalide" }, { status: 400 });
  }

  try {
    const supabase = createSupabaseServiceRoleClient();
    const { error } = await supabase
      .from("consultation_requests")
      .update({ status })
      .eq("id", id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Erreur serveur" },
      { status: 500 }
    );
  }
}
