import type { Metadata } from "next";
import Link from "next/link";
import { getHero, getFaqItems, getFaqPage } from "@/lib/data";
import PageHero from "@/components/shared/PageHero";
import CtaSection from "@/components/shared/CtaSection";
import FaqAccordion from "@/components/faq/FaqAccordion";
import Reveal from "@/components/animation/Reveal";

export async function generateMetadata(): Promise<Metadata> {
  const { seo } = await getFaqPage();
  return { title: { absolute: seo.title }, description: seo.description };
}

export default async function FaqPage() {
  const [hero, page, items] = await Promise.all([
    getHero("faq"),
    getFaqPage(),
    getFaqItems(),
  ]);

  return (
    <>
      <PageHero
        eyebrow={hero.eyebrow}
        titleLines={hero.titleLines}
        intro={hero.subtitle}
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
                <p className="eyebrow mb-6">{page.sideNote.eyebrow}</p>
                <p className="font-display text-2xl font-light leading-snug">
                  {page.sideNote.title}
                </p>
                <Link
                  href="/contact"
                  className="group mt-8 inline-flex items-center gap-3 border-b border-amethyst pb-2 text-[0.68rem] font-medium uppercase tracking-[0.28em] text-ivory transition-colors duration-500 hover:text-amethyst-bright"
                >
                  {page.sideNote.ctaLabel}
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
