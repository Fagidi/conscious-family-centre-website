"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { SiteSettings, Navigation } from "@/lib/types";
import { cn } from "@/lib/utils";
import Button from "@/components/ui/Button";
import AnnouncementBanner from "./AnnouncementBanner";
import FullscreenMenu from "./FullscreenMenu";
import SearchOverlay from "./SearchOverlay";

interface HeaderProps {
  settings: SiteSettings;
  /** Kept for API compatibility; top-level nav now lives in the fullscreen menu. */
  navigation: Navigation;
}

/**
 * TAS-inspired floating nav: announcement bar full-width at top, primary nav as a
 * floating card with margins overlaying the hero. No menu links in the bar.
 */
export default function Header({ settings }: HeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [announcementHeight, setAnnouncementHeight] = useState(0);

  useEffect(() => {
    const measure = () => {
      const h = document.querySelector('[data-announcement-bar]')?.clientHeight ?? 0;
      setAnnouncementHeight(h);
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > announcementHeight + 80);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [announcementHeight]);

  return (
    <>
      {/* Full-width announcement bar */}
      <div className="fixed inset-x-0 top-0 z-50" data-announcement-bar>
        <AnnouncementBanner announcement={settings.announcement} />
      </div>

      {/* Floating nav card — positioned over the hero with margins and premium styling */}
      <div
        className="fixed inset-x-0 z-40 pointer-events-none"
        style={{ top: announcementHeight ? `${announcementHeight + 16}px` : "64px" }}
      >
        <div className="mx-auto max-w-site px-gutter">
          <div className="pointer-events-auto rounded-2xl md:rounded-2xl flex items-center justify-between gap-3 md:gap-4 px-4 md:px-7 py-4 md:py-5 bg-cream shadow-lg">
            {/* Logo */}
            <Link href="/" className="font-display text-base md:text-lg font-semibold tracking-tight text-forest-900 flex-shrink-0 hover:text-leaf-600 transition-colors">
              {settings.siteName}
            </Link>

            {/* Right side: search, CTA, menu */}
            <div className="flex items-center gap-2 md:gap-4 ml-auto">
              {/* Search icon */}
              <button
                type="button"
                onClick={() => setSearchOpen(true)}
                aria-label="Search"
                className="flex h-10 w-10 md:h-9 md:w-9 items-center justify-center rounded-full text-forest-900 hover:text-leaf-600 hover:bg-forest-900/5 transition-all active:bg-forest-900/10"
              >
                <svg viewBox="0 0 24 24" aria-hidden className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="7" />
                  <path d="m20 20-3-3" />
                </svg>
              </button>

              {/* Book a Visit CTA */}
              <div className="hidden xs:block">
                <Button href="/contact" size="sm" variant="primary">
                  Book a Visit
                </Button>
              </div>

              {/* Menu button */}
              <button
                type="button"
                onClick={() => setMenuOpen(true)}
                aria-label="Open menu"
                aria-expanded={menuOpen}
                className="flex items-center gap-2 h-10 px-3 md:h-auto md:px-0 rounded-lg md:rounded-none text-sm md:text-sm font-semibold text-forest-900 hover:text-leaf-600 active:bg-forest-900/10 md:active:bg-transparent transition-colors md:transition-colors"
              >
                <span className="hidden sm:inline">Menu</span>
                <span aria-hidden className="flex flex-col gap-[5px]">
                  <span className="block h-0.5 w-5 rounded-full bg-current" />
                  <span className="block h-0.5 w-5 rounded-full bg-current" />
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <FullscreenMenu siteName={settings.siteName} open={menuOpen} onClose={() => setMenuOpen(false)} />
      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
