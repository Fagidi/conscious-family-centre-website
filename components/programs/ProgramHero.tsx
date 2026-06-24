"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import type { Cta, ImageAsset } from "@/lib/types";
import Button from "@/components/ui/Button";
import SmartImage from "@/components/ui/SmartImage";

const container = { hidden: {}, show: { transition: { staggerChildren: 0.12, delayChildren: 0.25 } } };
const rise = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] } },
};

interface ProgramHeroProps {
  eyebrow?: string;
  title: string;
  intro?: string;
  image: ImageAsset;
  ctas?: Cta[];
  /** Optional breadcrumb back-link (used on detail pages). */
  back?: { href: string; label: string };
}

/**
 * Editorial hero shared by the Programs index and program detail pages.
 * Full-bleed cinematic image + dark scrim so the transparent fixed header and
 * cream text stay legible; staggered headline, intro and CTAs.
 */
export default function ProgramHero({ eyebrow, title, intro, image, ctas, back }: ProgramHeroProps) {
  return (
    <section className="relative flex min-h-[80svh] items-end overflow-hidden">
      <motion.div
        initial={{ scale: 1.08, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
        className="absolute inset-0"
      >
        <SmartImage image={image} fill priority sizes="100vw" className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-forest-900/90 via-forest-900/45 to-forest-900/35" />
      </motion.div>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="relative z-10 mx-auto w-full max-w-content px-gutter pb-20 pt-44 text-cream md:pb-28"
      >
        {back && (
          <motion.div variants={rise}>
            <Link href={back.href} className="eyebrow text-sun-400 hover:text-sun-400/80">
              ← {back.label}
            </Link>
          </motion.div>
        )}
        {eyebrow && !back && (
          <motion.p variants={rise} className="eyebrow mb-5 text-sun-400">
            {eyebrow}
          </motion.p>
        )}
        <motion.h1 variants={rise} className="mt-4 max-w-4xl text-display-xl text-cream">
          {title}
        </motion.h1>
        {intro && (
          <motion.p variants={rise} className="mt-6 max-w-2xl text-lg leading-relaxed text-cream/85 md:text-xl">
            {intro}
          </motion.p>
        )}
        {ctas && ctas.length > 0 && (
          <motion.div variants={rise} className="mt-9 flex flex-wrap gap-3">
            {ctas.map((cta, i) => (
              <Button
                key={cta.label}
                href={cta.href}
                variant={i === 0 ? "primary" : "ghost"}
                className={i === 0 ? undefined : "border-cream/40 text-cream hover:bg-cream/10"}
              >
                {cta.label}
              </Button>
            ))}
          </motion.div>
        )}
      </motion.div>
    </section>
  );
}
