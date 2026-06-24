"use client";

import { motion } from "framer-motion";
import type { FaqPageContent } from "@/lib/types";
import SmartImage from "@/components/ui/SmartImage";
import FAQSearch from "./FAQSearch";

const container = { hidden: {}, show: { transition: { staggerChildren: 0.12, delayChildren: 0.2 } } };
const rise = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] } },
};

interface FAQHeroProps {
  hero: FaqPageContent["hero"];
  search: string;
  onSearch: (value: string) => void;
  resultCount: number;
}

/**
 * FAQ hero — editorial dark hero with the search input immediately visible.
 * The search is controlled by the FAQ orchestrator so results filter live.
 */
export default function FAQHero({ hero, search, onSearch, resultCount }: FAQHeroProps) {
  return (
    <section className="relative flex min-h-[70svh] items-end overflow-hidden">
      <motion.div
        initial={{ scale: 1.08, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
        className="absolute inset-0"
      >
        <SmartImage image={hero.image} fill priority sizes="100vw" className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-forest-900/92 via-forest-900/55 to-forest-900/40" />
      </motion.div>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="relative z-10 mx-auto w-full max-w-content px-gutter pb-16 pt-44 text-cream md:pb-20"
      >
        {hero.eyebrow && (
          <motion.p variants={rise} className="eyebrow mb-5 text-sun-400">
            {hero.eyebrow}
          </motion.p>
        )}
        <motion.h1 variants={rise} className="max-w-3xl text-display-xl text-cream">
          {hero.title}
        </motion.h1>
        {hero.intro && (
          <motion.p variants={rise} className="mt-6 max-w-2xl text-lg leading-relaxed text-cream/85">
            {hero.intro}
          </motion.p>
        )}
        <motion.div variants={rise} className="mt-8 max-w-xl">
          <FAQSearch
            id="faq-hero-search"
            value={search}
            onChange={onSearch}
            resultCount={resultCount}
            variant="light"
          />
        </motion.div>
      </motion.div>
    </section>
  );
}
