import type { Metadata } from "next";
import Link from "next/link";
import { getFaqItems } from "@/lib/data";
import { pageSeo } from "@/lib/content";
import PageHero from "@/components/shared/PageHero";
import CtaSection from "@/components/shared/CtaSection";
import FaqAccordion from "@/components/faq/FaqAccordion";
import Reveal from "@/components/animation/Reveal";

export const metadata: Metadata = {
  title: pageSeo.faq.title,
  description: pageSeo.faq.description,
};

export default async function FaqPage() {
  const items = await getFaqItems();

  return (
    <>
      <PageHero
        eyebrow="Questions, Answered"
        titleLines={["Everything you'd ask", "over a glass of champagne."]}
        intro="The details behind booking, logistics, and the experience itself. If your question isn't here, we're one note away."
      />

      <section className="bg-noir py-24 md:py-36">
        <div className="container-site grid grid-cols-1 gap-16 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <FaqAccordion items={items} />
          </div>

          {/* Side note */}
          <aside className="lg:col-span-3 lg:col-start-10">
            <Reveal className="lg:sticky lg:top-32">
              <div className="border border-noir-line p-9">
                <p className="eyebrow mb-6">Still Curious?</p>
                <p className="font-display text-2xl font-light leading-snug">
                  Ask us anything — we answer within one business day.
                </p>
                <Link
                  href="/contact"
                  className="group mt-8 inline-flex items-center gap-3 border-b border-amethyst pb-2 text-[0.68rem] font-medium uppercase tracking-[0.28em] text-ivory transition-colors duration-500 hover:text-amethyst-bright"
                >
                  Start the Conversation
                  <span aria-hidden className="transition-transform duration-500 ease-luxe group-hover:translate-x-2">
                    →
                  </span>
                </Link>
              </div>
            </Reveal>
          </aside>
        </div>
      </section>

      <CtaSection />
    </>
  );
}
