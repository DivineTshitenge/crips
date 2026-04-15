import { createSupabaseServiceRoleClient } from "@/lib/supabase-auth";
import RendezVousTable, { type RendezVousRow } from "@/components/admin/RendezVousTable";

export const dynamic = "force-dynamic";

export default async function AdminRendezVousPage() {
  let rows: RendezVousRow[] = [];
  let errorMsg: string | null = null;

  try {
    const supabase = createSupabaseServiceRoleClient();
    const { data, error } = await supabase
      .from("consultation_requests")
      .select(
        "id, full_name, email, phone, message, preferred_contact, status, created_at"
      )
      .order("created_at", { ascending: false })
      .limit(200);
    if (error) {
      errorMsg = error.message;
    } else {
      rows = (data ?? []) as RendezVousRow[];
    }
  } catch (e) {
    errorMsg = e instanceof Error ? e.message : "Erreur inconnue";
  }

  return (
    <>
      <h1 className="admin-page-title">Rendez-vous</h1>
      <p className="admin-page-desc">
        Liste des demandes reçues depuis le formulaire de contact du site.
      </p>

      {errorMsg ? (
        <div className="admin-msg admin-msg--err">
          Impossible de charger les rendez-vous : {errorMsg}
        </div>
      ) : null}

      <RendezVousTable rows={rows} />
    </>
  );
}
