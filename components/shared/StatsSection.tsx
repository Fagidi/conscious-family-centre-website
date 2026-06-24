"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { prefersReducedMotion } from "@/lib/motion";
import Container from "@/components/ui/Container";

export interface Stat {
  value: number;
  suffix?: string;
  label: string;
}

interface StatsSectionProps {
  eyebrow?: string;
  heading?: string;
  stats: Stat[];
  tone?: "forest" | "sage";
}

const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

function Counter({ target, run }: { target: number; run: boolean }) {
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!run) return;
    if (prefersReducedMotion()) {
      setN(target);
      return;
    }
    let raf = 0;
    const start = performance.now();
    const duration = 1500;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / duration);
      setN(Math.round(easeOut(p) * target));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [run, target]);
  return <>{n}</>;
}

/**
 * Premium impact band with large animated counters. Counts up once it scrolls
 * into view (honors reduced-motion). Numbers are passed in by the caller.
 */
export default function StatsSection({ eyebrow, heading, stats, tone = "forest" }: StatsSectionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [run, setRun] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => entries.some((e) => e.isIntersecting) && (setRun(true), observer.disconnect()),
      { threshold: 0.3 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const dark = tone === "forest";

  return (
    <section ref={ref} className={cn("py-24 md:py-32", dark ? "bg-forest-900 text-cream" : "bg-sage-100 text-bark-700")}>
      <Container>
        {(eyebrow || heading) && (
          <div className="mb-16 max-w-2xl">
            {eyebrow && <p className={cn("eyebrow mb-4", dark && "text-sun-400")}>{eyebrow}</p>}
            {heading && <h2 className={cn("text-display-lg", dark && "text-cream")}>{heading}</h2>}
          </div>
        )}
        <dl className="grid grid-cols-2 gap-x-10 gap-y-16 lg:grid-cols-4 lg:gap-x-12">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: i * 0.08 }}
            >
              <dt className="sr-only">{stat.label}</dt>
              <dd>
                <span className={cn("block font-display text-display-xl leading-none", dark ? "text-cream" : "text-forest-900")}>
                  <Counter target={stat.value} run={run} />
                  {stat.suffix && <span className="text-leaf-500">{stat.suffix}</span>}
                </span>
                <span className={cn("mt-3 block text-sm font-medium uppercase tracking-wide", dark ? "text-cream/70" : "text-bark-700/70")}>
                  {stat.label}
                </span>
              </dd>
            </motion.div>
          ))}
        </dl>
      </Container>
    </section>
  );
}
