import { Suspense } from "react";
import AdminLoginClient from "./AdminLoginClient";

export default function AdminLoginPage() {
  return (
    <Suspense fallback={<div className="admin-login-card">Chargement…</div>}>
      <AdminLoginClient />
    </Suspense>
  );
}
