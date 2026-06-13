import Link from "next/link";
import Reveal from "@/components/animation/Reveal";
import TextReveal from "@/components/animation/TextReveal";
import type { SiteSettings } from "@/lib/types";

const NAV = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "FAQ", href: "/faq" },
  { label: "Contact", href: "/contact" },
];

export default function Footer({ settings }: { settings: SiteSettings }) {
  const year = new Date().getFullYear();

  return (
    <footer className="hairline bg-noir">
      <div className="container-site pb-12 pt-24 md:pt-32">
        {/* Invitation */}
        <div className="mb-20 flex flex-col items-start justify-between gap-10 md:mb-28 md:flex-row md:items-end">
          <div>
            <Reveal y={24}>
              <p className="eyebrow mb-6">{settings.announcement}</p>
            </Reveal>
            <TextReveal
              as="p"
              lines={settings.footerInvitationLines}
              className="font-display text-display-lg font-light"
            />
          </div>
          <Reveal delay={0.2}>
            <Link
              href="/contact"
              className="group inline-flex items-center gap-4 border-b border-amethyst pb-3 text-[0.72rem] font-medium uppercase tracking-[0.3em] text-ivory transition-colors duration-500 hover:text-amethyst-bright"
            >
              {settings.bookingCtaLabel}
              <span aria-hidden className="transition-transform duration-500 ease-luxe group-hover:translate-x-2">
                →
              </span>
            </Link>
          </Reveal>
        </div>

        {/* Columns */}
        <Reveal stagger={0.08} className="grid grid-cols-1 gap-12 border-t border-noir-line pt-14 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="font-display text-xl tracking-[0.18em]">SARAI</p>
            <p className="mt-4 max-w-xs text-sm font-light leading-relaxed text-ivory-dim">
              {settings.tagline}. {settings.serviceArea}.
            </p>
          </div>
          <nav aria-label="Footer">
            <p className="eyebrow mb-5">Navigate</p>
            <ul className="space-y-3">
              {NAV.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="link-underline text-sm font-light text-ivory/75 transition-colors duration-400 hover:text-ivory"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div>
            <p className="eyebrow mb-5">Contact</p>
            <ul className="space-y-3 text-sm font-light text-ivory/75">
              <li>
                <a className="link-underline hover:text-ivory" href={`mailto:${settings.email}`}>
                  {settings.email}
                </a>
              </li>
              <li>
                <a className="link-underline hover:text-ivory" href={`tel:${settings.phone.replace(/[^+\d]/g, "")}`}>
                  {settings.phone}
                </a>
              </li>
              <li className="text-ivory-dim">{settings.location}</li>
            </ul>
          </div>
          <div>
            <p className="eyebrow mb-5">Follow</p>
            <a
              href={settings.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="link-underline text-sm font-light text-ivory/75 hover:text-ivory"
            >
              Instagram
            </a>
          </div>
        </Reveal>

        {/* Legal */}
        <div className="mt-16 flex flex-col gap-3 border-t border-noir-line pt-8 text-[0.68rem] font-light uppercase tracking-[0.22em] text-ivory-faint sm:flex-row sm:items-center sm:justify-between">
          <p>© {year} {settings.siteName}. All rights reserved.</p>
          <p>{settings.location}</p>
        </div>
      </div>

      {/* Oversized wordmark */}
      <div className="overflow-hidden" aria-hidden="true">
        <p className="container-site select-none text-center font-display text-[clamp(5rem,18vw,18rem)] font-light leading-[0.78] tracking-[0.12em] text-noir-raise">
          SARAI
        </p>
      </div>
    </footer>
  );
}
