"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import type { HomeHero } from "@/lib/types";
import Button from "@/components/ui/Button";
import SmartImage from "@/components/ui/SmartImage";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.25 } },
};
const rise = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 1, ease: [0.16, 1, 0.3, 1] } },
};

/**
 * Full-viewport editorial hero. Cinematic image with a slow scale-in, a soft
 * scrim for legible cream text, an oversized display headline, and a clear
 * three-tier CTA hierarchy. Content is CMS-driven (homePage.hero).
 */
export default function Hero({ hero }: { hero: HomeHero }) {
  return (
    <section className="relative flex min-h-svh items-end overflow-hidden">
      <motion.div
        initial={{ scale: 1.1, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1] }}
        className="absolute inset-0"
      >
        <SmartImage image={hero.image} fill priority sizes="100vw" className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-forest-900/92 via-forest-900/45 to-forest-900/25" />
        <div className="absolute inset-0 bg-gradient-to-r from-forest-900/50 to-transparent" />
      </motion.div>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="relative z-10 mx-auto w-full max-w-site px-gutter pb-24 pt-44 text-cream md:pb-32"
      >
        {hero.eyebrow && (
          <motion.p
            variants={rise}
            className="mb-6 inline-flex items-center rounded-full border border-cream/25 px-4 py-1.5 text-eyebrow font-semibold uppercase text-cream/90 backdrop-blur-sm"
          >
            {hero.eyebrow}
          </motion.p>
        )}
        <motion.h1 variants={rise} className="max-w-5xl text-display-2xl text-cream">
          {hero.headline}
        </motion.h1>
        {hero.subhead && (
          <motion.p variants={rise} className="mt-8 max-w-2xl text-lg leading-relaxed text-cream/85 md:text-xl">
            {hero.subhead}
          </motion.p>
        )}
        <motion.div variants={rise} className="mt-10 flex flex-wrap items-center gap-x-3 gap-y-3">
          <Button href={hero.primaryCta.href} size="lg">
            {hero.primaryCta.label}
          </Button>
          <Button
            href={hero.secondaryCta.href}
            size="lg"
            variant="ghost"
            className="border-cream/40 text-cream hover:bg-cream/10"
          >
            {hero.secondaryCta.label}
          </Button>
          {hero.tertiaryCta && (
            <Link href={hero.tertiaryCta.href} className="ml-1 inline-flex items-center gap-1.5 text-sm font-semibold text-sun-400 underline-offset-4 hover:underline">
              {hero.tertiaryCta.label} <span aria-hidden>→</span>
            </Link>
          )}
        </motion.div>
      </motion.div>
    </section>
  );
}
