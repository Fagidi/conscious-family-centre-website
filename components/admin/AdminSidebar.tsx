"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const NAV = [
  { href: "/admin/dashboard",      label: "Dashboard",      icon: "▣" },
  { href: "/admin/registrations",  label: "Registrations",  icon: "▤" },
  { href: "/admin/payments",       label: "Payments",       icon: "₢" },
  { href: "/admin/reports",        label: "Reports",        icon: "▦" },
  { href: "/admin/settings",       label: "Settings",       icon: "◈" },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router   = useRouter();

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
  }

  return (
    <aside className="flex h-screen w-60 flex-shrink-0 flex-col bg-forest-900">
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-6 border-b border-white/10">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-leaf-600 text-white text-sm font-bold">
          CFC
        </div>
        <div>
          <p className="text-xs font-semibold text-white leading-tight">Conscious Family</p>
          <p className="text-xs text-white/50 leading-tight">Admin Dashboard</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-0.5">
        <p className="px-2 mb-2 text-[10px] font-semibold uppercase tracking-widest text-white/30">Menu</p>
        {NAV.map(({ href, label, icon }) => {
          const active = pathname === href || pathname.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
                active
                  ? "bg-white/10 text-white font-medium"
                  : "text-white/60 hover:bg-white/5 hover:text-white"
              }`}
            >
              <span className="text-base w-5 text-center opacity-70">{icon}</span>
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-3 py-4 border-t border-white/10 space-y-0.5">
        <p className="px-2 mb-2 text-[10px] font-semibold uppercase tracking-widest text-white/30">External</p>
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-white/60 hover:bg-white/5 hover:text-white transition-colors"
        >
          <span className="text-base w-5 text-center opacity-70">↗</span>
          Website
        </a>
        <a
          href="/studio"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-white/60 hover:bg-white/5 hover:text-white transition-colors"
        >
          <span className="text-base w-5 text-center opacity-70">↗</span>
          Sanity Studio
        </a>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-white/60 hover:bg-red-500/20 hover:text-red-300 transition-colors"
        >
          <span className="text-base w-5 text-center opacity-70">⏻</span>
          Log Out
        </button>
      </div>
    </aside>
  );
}
