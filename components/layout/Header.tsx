"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import type { SiteSettings } from "@/lib/types";

gsap.registerPlugin(useGSAP);

const NAV = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "FAQ", href: "/faq" },
  { label: "Contact", href: "/contact" },
];

export default function Header({ settings }: { settings: SiteSettings }) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  // Entrance
  useGSAP(() => {
    gsap.fromTo(
      headerRef.current,
      { y: -32, autoAlpha: 0 },
      { y: 0, autoAlpha: 1, duration: 1.1, delay: 0.4, ease: "power3.out" },
    );
  });

  // Solid backdrop after the hero
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close menu on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  // Mobile overlay animation + scroll lock
  useEffect(() => {
    const overlay = overlayRef.current;
    if (!overlay) return;

    if (menuOpen) {
      document.body.style.overflow = "hidden";
      gsap.fromTo(
        overlay,
        { clipPath: "inset(0% 0% 100% 0%)" },
        { clipPath: "inset(0% 0% 0% 0%)", duration: 0.8, ease: "power4.inOut" },
      );
      gsap.fromTo(
        overlay.querySelectorAll("[data-menu-item]"),
        { y: 56, autoAlpha: 0 },
        { y: 0, autoAlpha: 1, duration: 0.9, stagger: 0.07, delay: 0.35, ease: "power3.out" },
      );
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <>
      <header
        ref={headerRef}
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-700 ease-luxe ${
          scrolled
            ? "border-b border-noir-line/60 bg-noir/85 backdrop-blur-md"
            : "bg-transparent"
        }`}
      >
        <div className="container-site flex items-center justify-between py-5 md:py-6">
          <Link href="/" className="group relative z-50 leading-none" aria-label="Sarai Photo Booth — home">
            <span className="font-display text-2xl font-medium tracking-[0.18em] text-ivory transition-colors duration-500 group-hover:text-amethyst-bright">
              SARAI
            </span>
            <span className="ml-3 hidden text-[0.58rem] font-light uppercase tracking-[0.42em] text-ivory-dim sm:inline">
              Photo Booth
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-10 lg:flex" aria-label="Primary">
            {NAV.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`link-underline text-[0.7rem] font-medium uppercase tracking-[0.26em] transition-colors duration-400 ${
                    active ? "text-amethyst-bright" : "text-ivory/80 hover:text-ivory"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
            <Link
              href="/contact"
              className="border border-amethyst/70 px-6 py-3 text-[0.66rem] font-medium uppercase tracking-[0.26em] text-ivory transition-all duration-500 ease-luxe hover:bg-amethyst hover:text-white"
            >
              {settings.bookingCtaLabel}
            </Link>
          </nav>

          {/* Mobile toggle */}
          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            className="relative z-50 flex h-10 w-10 flex-col items-center justify-center gap-[7px] lg:hidden"
            aria-expanded={menuOpen}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
          >
            <span
              className={`h-px w-7 bg-ivory transition-transform duration-500 ease-luxe ${
                menuOpen ? "translate-y-1 rotate-45" : ""
              }`}
            />
            <span
              className={`h-px w-7 bg-ivory transition-transform duration-500 ease-luxe ${
                menuOpen ? "-translate-y-1.5 -rotate-45" : ""
              }`}
            />
          </button>
        </div>
      </header>

      {/* Mobile overlay menu */}
      <div
        ref={overlayRef}
        className={`fixed inset-0 z-40 flex flex-col justify-between bg-noir px-6 pb-10 pt-32 lg:hidden ${
          menuOpen ? "" : "pointer-events-none invisible"
        }`}
        aria-hidden={!menuOpen}
      >
        <nav className="flex flex-col gap-2" aria-label="Mobile">
          {NAV.map((item, i) => (
            <div key={item.href} className="overflow-hidden">
              <Link
                data-menu-item
                href={item.href}
                className={`block py-2 font-display text-5xl font-light transition-colors duration-400 ${
                  pathname === item.href ? "text-amethyst-bright" : "text-ivory"
                }`}
              >
                <span className="mr-4 align-super text-xs text-ivory-faint">0{i + 1}</span>
                {item.label}
              </Link>
            </div>
          ))}
        </nav>
        <div data-menu-item className="space-y-3">
          <p className="eyebrow">{settings.location}</p>
          <a href={`mailto:${settings.email}`} className="link-underline block text-sm text-ivory/80">
            {settings.email}
          </a>
          <a href={`tel:${settings.phone.replace(/[^+\d]/g, "")}`} className="link-underline block text-sm text-ivory/80">
            {settings.phone}
          </a>
        </div>
      </div>
    </>
  );
}
