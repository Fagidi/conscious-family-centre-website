"use client";

import { useEffect, useRef, useState } from "react";
import type { SiteSettings } from "@/lib/types";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";

/**
 * Location map — lazily mounts the Google Maps embed only when scrolled into
 * view (keeps the third-party iframe off the critical path). CMS-driven via
 * site settings (address + map URL). No API key required for the embed.
 */
export default function MapSection({ settings }: { settings: SiteSettings }) {
  const { address } = settings;
  const ref = useRef<HTMLDivElement>(null);
  const [show, setShow] = useState(false);

  const query =
    address.lat && address.lng
      ? `${address.lat},${address.lng}`
      : `${address.line}, ${address.area}, ${address.city}`;
  const embedSrc = `https://maps.google.com/maps?q=${encodeURIComponent(query)}&z=15&output=embed`;

  useEffect(() => {
    const el = ref.current;
    if (!el || show) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setShow(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [show]);

  return (
    <section className="bg-cream pb-16 md:pb-24">
      <Container>
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="eyebrow mb-2">Find us</p>
            <h2 className="text-display-sm text-forest-900">{address.line}</h2>
            <p className="mt-1 text-bark-700/80">
              {address.area}, {address.city}
            </p>
          </div>
          <Button href={address.mapUrl} variant="ghost">
            Get directions
          </Button>
        </div>

        <div
          ref={ref}
          className="relative aspect-[16/9] w-full overflow-hidden rounded-card-lg border border-forest-700/10 bg-sage-100 md:aspect-[21/9]"
        >
          {show ? (
            <iframe
              title={`Map showing ${address.line}, ${address.area}, ${address.city}`}
              src={embedSrc}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="absolute inset-0 h-full w-full border-0"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-bark-700/50">
              <span className="text-sm">Loading map…</span>
            </div>
          )}
        </div>
      </Container>
    </section>
  );
}
