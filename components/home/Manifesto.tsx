import Reveal from "@/components/animation/Reveal";
import TextReveal from "@/components/animation/TextReveal";
import type { HomePageContent } from "@/lib/types";

interface ManifestoProps {
  manifesto: HomePageContent["manifesto"];
  stats: HomePageContent["stats"];
}

/**
 * The brand statement — pure typography on black, maximum whitespace.
 */
export default function Manifesto({ manifesto, stats }: ManifestoProps) {
  return (
    <section className="bg-noir py-32 md:py-44">
      <div className="container-site">
        <Reveal y={24}>
          <p className="eyebrow mb-12 flex items-center gap-4">
            <span className="inline-block h-px w-10 bg-amethyst" aria-hidden />
            {manifesto.eyebrow}
          </p>
        </Reveal>

        <TextReveal
          as="h2"
          lines={manifesto.lines}
          className="max-w-4xl font-display text-display-lg font-light"
        />

        <div className="mt-16 grid grid-cols-1 gap-12 md:grid-cols-12">
          <Reveal className="md:col-span-5 md:col-start-8" delay={0.15}>
            <p className="text-base font-light leading-relaxed text-ivory-dim">
              {manifesto.body}
            </p>
          </Reveal>
        </div>

        {/* Quiet proof */}
        <Reveal
          stagger={0.1}
          className="mt-28 grid grid-cols-2 gap-y-12 border-t border-noir-line pt-12 md:grid-cols-4"
        >
          {stats.map((stat) => (
            <div key={stat.label}>
              <p className="font-display text-5xl font-light text-ivory md:text-6xl">
                {stat.value}
              </p>
              <p className="mt-3 text-[0.68rem] uppercase tracking-[0.28em] text-ivory-faint">
                {stat.label}
              </p>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
