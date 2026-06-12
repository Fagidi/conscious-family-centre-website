"use client";

import { useRef } from "react";
import Image from "@/components/ui/CineImage";
import dynamic from "next/dynamic";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import TextReveal from "@/components/animation/TextReveal";
import Button from "@/components/ui/Button";
import type { HeroContent } from "@/lib/types";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const AmbientParticles = dynamic(() => import("@/components/three/AmbientParticles"), {
  ssr: false,
});

export default function Hero({ content }: { content: HeroContent }) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;

      // Cinematic settle on load
      gsap.fromTo(
        "[data-hero-image]",
        { scale: 1.12, autoAlpha: 0 },
        { scale: 1, autoAlpha: 1, duration: 2.2, ease: "power3.out" },
      );
      gsap.fromTo(
        "[data-hero-meta]",
        { autoAlpha: 0, y: 28 },
        { autoAlpha: 1, y: 0, duration: 1.2, stagger: 0.15, delay: 0.9, ease: "power3.out" },
      );

      // Slow departure parallax as the user scrolls away
      gsap.to("[data-hero-image]", {
        yPercent: 14,
        scale: 1.06,
        ease: "none",
        scrollTrigger: { trigger: el, start: "top top", end: "bottom top", scrub: 0.6 },
      });
      gsap.to("[data-hero-content]", {
        yPercent: -10,
        autoAlpha: 0.25,
        ease: "none",
        scrollTrigger: { trigger: el, start: "top top", end: "75% top", scrub: 0.6 },
      });
    },
    { scope: ref },
  );

  return (
    <section ref={ref} className="grain relative flex h-svh min-h-[640px] items-end overflow-hidden">
      {/* Cinematic backdrop */}
      <div data-hero-image className="absolute inset-0 will-change-transform">
        <Image
          src={content.image}
          alt={content.imageAlt}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-noir via-noir/45 to-noir/30" />
      <div className="absolute inset-0 bg-gradient-to-r from-noir/55 via-transparent to-transparent" />

      {/* Ambient depth */}
      <AmbientParticles className="absolute inset-0 z-[1]" />

      {/* Content */}
      <div data-hero-content className="container-site relative z-10 pb-20 md:pb-28">
        <p data-hero-meta className="eyebrow mb-7 flex items-center gap-4">
          <span className="inline-block h-px w-10 bg-amethyst" aria-hidden />
          {content.eyebrow}
        </p>

        <TextReveal
          as="h1"
          immediate
          delay={0.5}
          lines={content.titleLines}
          className="max-w-5xl font-display text-display-xl font-light"
        />

        <div className="mt-10 flex flex-col gap-10 md:flex-row md:items-end md:justify-between">
          <p data-hero-meta className="max-w-md text-base font-light leading-relaxed text-ivory/80">
            {content.subtitle}
          </p>
          <div data-hero-meta className="flex flex-wrap items-center gap-5">
            <Button href={content.ctaHref}>{content.ctaLabel}</Button>
            {content.secondaryCtaLabel && content.secondaryCtaHref && (
              <Button href={content.secondaryCtaHref} variant="ghost">
                {content.secondaryCtaLabel}
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Scroll cue */}
      <div
        data-hero-meta
        className="absolute bottom-8 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-3 md:flex"
        aria-hidden="true"
      >
        <span className="text-[0.6rem] uppercase tracking-[0.4em] text-ivory-dim">Scroll</span>
        <span className="block h-12 w-px animate-pulse bg-gradient-to-b from-amethyst to-transparent" />
      </div>
    </section>
  );
}
