"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const SUB_NAV = [
  { href: "/admin/settings/general",        label: "General" },
  { href: "/admin/settings/notifications",  label: "Notifications" },
  { href: "/admin/settings/branding",       label: "Email Branding" },
  { href: "/admin/settings/integrations",   label: "Integrations" },
  { href: "/admin/settings/security",       label: "Security" },
  { href: "/admin/settings/administrators", label: "Administrators" },
  { href: "/admin/settings/backups",        label: "Backups" },
];

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  return (
    <div className="flex flex-1 flex-col min-h-0">
      {/* Sub-navigation tabs */}
      <div className="sticky top-[65px] z-10 border-b border-gray-200 bg-white px-6">
        <nav className="flex gap-1 -mb-px overflow-x-auto">
          {SUB_NAV.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`shrink-0 px-3 py-3 text-sm font-medium border-b-2 transition-colors ${
                  active
                    ? "border-forest-600 text-forest-700"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
      {children}
    </div>
  );
}
