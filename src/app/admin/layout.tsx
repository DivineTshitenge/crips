import AdminShell from "@/components/admin/AdminShell";
import "./admin.css";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Administration | CRIPS",
  robots: { index: false, follow: false },
};

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <AdminShell>{children}</AdminShell>;
}
