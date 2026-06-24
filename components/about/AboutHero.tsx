"use client";

import { motion } from "framer-motion";
import type { AboutContent } from "@/lib/types";
import SmartImage from "@/components/ui/SmartImage";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.25 } },
};
const rise = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] } },
};

/**
 * Editorial About hero. Full-bleed cinematic image with a slow scale-in and a
 * dark scrim so the (transparent) fixed header + cream text stay legible. The
 * mission statement is the emotional through-line for the whole page.
 */
export default function AboutHero({ hero }: { hero: AboutContent["hero"] }) {
  return (
    <section className="relative flex min-h-[88svh] items-end overflow-hidden">
      <motion.div
        initial={{ scale: 1.08, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
        className="absolute inset-0"
      >
        <SmartImage image={hero.image} fill priority sizes="100vw" className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-forest-900/90 via-forest-900/45 to-forest-900/35" />
      </motion.div>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="relative z-10 mx-auto w-full max-w-content px-gutter pb-20 pt-44 text-cream md:pb-28"
      >
        {hero.eyebrow && (
          <motion.p variants={rise} className="eyebrow mb-5 text-sun-400">
            {hero.eyebrow}
          </motion.p>
        )}
        <motion.h1 variants={rise} className="max-w-4xl text-display-xl text-cream">
          {hero.title}
        </motion.h1>
        {hero.mission && (
          <motion.p variants={rise} className="mt-6 max-w-2xl text-lg leading-relaxed text-cream/85 md:text-xl">
            {hero.mission}
          </motion.p>
        )}
      </motion.div>
    </section>
  );
}
