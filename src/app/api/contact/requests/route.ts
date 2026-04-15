import { NextResponse } from "next/server";
import { createSupabaseServiceRoleClient } from "@/lib/supabase-auth";

type Body = {
  fullName?: string;
  email?: string;
  phone?: string;
  message?: string;
};

export async function POST(request: Request) {
  let body: Body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Corps JSON invalide." }, { status: 400 });
  }

  const fullName = body.fullName?.trim();
  const email = body.email?.trim().toLowerCase();
  const phone = body.phone?.trim() || null;
  const message = body.message?.trim();

  if (!fullName || fullName.length < 2) {
    return NextResponse.json({ error: "Nom complet invalide." }, { status: 400 });
  }
  if (!email || !email.includes("@")) {
    return NextResponse.json({ error: "Email invalide." }, { status: 400 });
  }
  if (!message || message.length < 5) {
    return NextResponse.json({ error: "Message trop court." }, { status: 400 });
  }

  try {
    const supabase = createSupabaseServiceRoleClient();
    const { error } = await supabase.from("consultation_requests").insert({
      full_name: fullName,
      email,
      phone,
      message,
      preferred_contact: phone ? "phone" : "email",
      source_page: "home",
      status: "new",
    });
    if (error) {
      return NextResponse.json(
        {
          error:
            "Impossible d'enregistrer votre demande. Vérifiez que la table consultation_requests existe.",
        },
        { status: 500 }
      );
    }
    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Erreur serveur";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
