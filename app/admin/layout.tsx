"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type Me = { username: string; role: string } | null;

const ROLE_LABEL: Record<string, string> = {
  super_admin: "Super Admin",
  editor: "Editor",
  viewer: "Viewer",
};

const ROLE_COLOR: Record<string, string> = {
  super_admin: "text-red-400",
  editor: "text-yellow-400",
  viewer: "text-zinc-400",
};

const buildNav = (role: string) => [
  { href: "/admin", label: "Dashboard", icon: "▦" },
  { href: "/admin/bookings", label: "Bookings", icon: "📅" },
  { href: "/admin/listings", label: "Host Listings", icon: "🚗" },
  { href: "/admin/cars", label: "Fleet", icon: "🏎" },
  { href: "/admin/contacts", label: "Messages", icon: "✉" },
  { href: "/admin/locations", label: "Locations", icon: "📍" },
  { href: "/admin/faqs", label: "FAQs", icon: "❓" },
  { href: "/admin/business", label: "Business Info", icon: "⚙" },
  { href: "/admin/portal-users", label: "Portal Users", icon: "🧑‍💼" },
  ...(role === "super_admin" ? [{ href: "/admin/users", label: "Admin Users", icon: "👥" }] : []),
];

function Sidebar({
  me,
  onClose,
  onLogout,
  loggingOut,
}: {
  me: Me;
  onClose?: () => void;
  onLogout: () => void;
  loggingOut: boolean;
}) {
  const pathname = usePathname();
  const nav = buildNav(me?.role ?? "");

  return (
    <div className="flex flex-col h-full bg-zinc-900 w-64">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-800 shrink-0">
        <div>
          <span className="text-base font-bold tracking-tight text-white">ToYou</span>
          <span className="ml-1 text-xs text-zinc-500 font-medium uppercase tracking-wider">Admin</span>
        </div>
        {onClose && (
          <button onClick={onClose} className="text-zinc-400 hover:text-white p-1 rounded" aria-label="Close menu">
            ✕
          </button>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 py-3 overflow-y-auto">
        {nav.map(({ href, label, icon }) => {
          const active = pathname === href || (href !== "/admin" && pathname.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              onClick={onClose}
              className={`flex items-center gap-3 px-5 py-2.5 text-sm transition-colors ${
                active
                  ? "bg-red-600/20 text-red-400 font-medium border-r-2 border-red-500"
                  : "text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800"
              }`}
            >
              <span className="text-base w-5 text-center shrink-0">{icon}</span>
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-zinc-800 shrink-0 space-y-3">
        {me && (
          <div className="px-1">
            <div className="text-sm text-white font-medium truncate">{me.username}</div>
            <div className={`text-xs ${ROLE_COLOR[me.role] ?? "text-zinc-400"}`}>
              {ROLE_LABEL[me.role] ?? me.role}
            </div>
          </div>
        )}
        <button
          onClick={onLogout}
          disabled={loggingOut}
          className="w-full text-sm text-zinc-400 hover:text-white py-2 px-3 rounded hover:bg-zinc-800 transition-colors text-left"
        >
          {loggingOut ? "Logging out…" : "← Log out"}
        </button>
      </div>
    </div>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [me, setMe] = useState<Me>(null);
  const [loggingOut, setLoggingOut] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (pathname !== "/admin/login") {
      fetch("/api/admin/me")
        .then((r) => (r.ok ? r.json() : null))
        .then((data) => setMe(data))
        .catch(() => {});
    }
  }, [pathname]);

  // Close drawer on route change
  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  async function handleLogout() {
    setLoggingOut(true);
    await fetch("/api/admin/auth", { method: "DELETE" });
    router.push("/admin/login");
  }

  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  return (
    <div className="flex h-screen bg-zinc-950 text-zinc-100 overflow-hidden">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-64 shrink-0 border-r border-zinc-800">
        <Sidebar me={me} onLogout={handleLogout} loggingOut={loggingOut} />
      </aside>

      {/* Mobile overlay drawer */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
          />
          {/* Drawer */}
          <div className="relative z-10 flex flex-col w-64 h-full shadow-2xl">
            <Sidebar
              me={me}
              onClose={() => setSidebarOpen(false)}
              onLogout={handleLogout}
              loggingOut={loggingOut}
            />
          </div>
        </div>
      )}

      {/* Main area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile topbar */}
        <header className="lg:hidden flex items-center gap-3 px-4 py-3 bg-zinc-900 border-b border-zinc-800 shrink-0">
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-zinc-400 hover:text-white p-1.5 rounded hover:bg-zinc-800 transition-colors"
            aria-label="Open menu"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <span className="text-sm font-bold text-white">ToYou <span className="text-red-500">Admin</span></span>
          {me && (
            <span className={`ml-auto text-xs ${ROLE_COLOR[me.role] ?? "text-zinc-400"}`}>
              {me.username}
            </span>
          )}
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
