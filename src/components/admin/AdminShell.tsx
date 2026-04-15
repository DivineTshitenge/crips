"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  ImageIcon,
  BarChart3,
  CalendarDays,
  LogOut,
  PlusCircle,
} from "lucide-react";

const nav = [
  { href: "/admin", label: "Tableau de bord", icon: LayoutDashboard },
  { href: "/admin/articles", label: "Articles", icon: FileText },
  { href: "/admin/articles/nouveau", label: "Nouvel article", icon: PlusCircle },
  { href: "/admin/medias", label: "Médiathèque", icon: ImageIcon },
  { href: "/admin/rendez-vous", label: "Rendez-vous", icon: CalendarDays },
  { href: "/admin/statistiques", label: "Statistiques", icon: BarChart3 },
];

function navLinkActive(href: string, pathname: string): boolean {
  if (href === "/admin") return pathname === "/admin";
  if (href === "/admin/articles") {
    return (
      pathname === "/admin/articles" ||
      /\/admin\/articles\/[^/]+\/modifier$/.test(pathname)
    );
  }
  if (href === "/admin/articles/nouveau") return pathname === href;
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function AdminShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isLogin = pathname === "/admin/login";

  if (isLogin) {
    return <div className="admin-login-root">{children}</div>;
  }

  return (
    <div className="admin-root">
      <aside className="admin-sidebar" aria-label="Navigation administration">
        <div className="admin-sidebar-brand">
          <Link href="/admin">
            <img src="/logo-crips.png" alt="Logo CRIPS" className="admin-brand-logo" />
            <span>CRIPS — Admin</span>
          </Link>
        </div>
        <nav className="admin-sidebar-nav">
          {nav.map(({ href, label, icon: Icon }) => {
            const active = navLinkActive(href, pathname);
            return (
              <Link
                key={href}
                href={href}
                className={`admin-sidebar-link ${active ? "admin-sidebar-link--active" : ""}`}
              >
                <Icon size={18} aria-hidden />
                {label}
              </Link>
            );
          })}
        </nav>
        <div className="admin-sidebar-footer">
          <Link href="/" className="admin-sidebar-link admin-sidebar-link--ghost">
            Voir le site
          </Link>
          <LogoutButton />
        </div>
      </aside>
      <div className="admin-main-wrap">
        <main className="admin-main">{children}</main>
      </div>
    </div>
  );
}

function LogoutButton() {
  return (
    <button
      type="button"
      className="admin-sidebar-link admin-sidebar-link--ghost admin-sidebar-logout"
      onClick={async () => {
        await fetch("/api/admin/logout", { method: "POST" });
        window.location.href = "/admin/login";
      }}
    >
      <LogOut size={18} aria-hidden />
      Déconnexion
    </button>
  );
}
