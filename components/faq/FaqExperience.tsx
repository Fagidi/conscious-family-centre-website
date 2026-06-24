"use client";

import { useMemo, useState } from "react";
import type { FaqCategoryDoc, FaqItem, FaqPageContent } from "@/lib/types";
import Container from "@/components/ui/Container";
import Reveal from "@/components/motion/Reveal";
import FAQHero from "./FAQHero";
import FeaturedQuestions from "./FeaturedQuestions";
import FAQCategoryTabs from "./FAQCategoryTabs";
import FAQSearch from "./FAQSearch";
import FaqPageAccordion from "./FaqPageAccordion";
import EmptySearchState from "./EmptySearchState";

interface FaqExperienceProps {
  content: FaqPageContent;
  items: FaqItem[];
  categories: FaqCategoryDoc[];
}

function matches(item: FaqItem, q: string): boolean {
  if (!q) return true;
  const answer = typeof item.answer === "string" ? item.answer : "";
  return `${item.question} ${answer}`.toLowerCase().includes(q.toLowerCase());
}

/**
 * Orchestrates the interactive FAQ: a shared search (hero + browse), category
 * tabs, the deep-linked accordion, featured questions and the empty state.
 * State lives here so the hero search and the browse list stay in sync.
 */
export default function FaqExperience({ content, items, categories }: FaqExperienceProps) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");

  const searching = search.trim().length > 0;

  const counts = useMemo(() => {
    const c: Record<string, number> = {};
    for (const item of items) c[item.category] = (c[item.category] ?? 0) + 1;
    return c;
  }, [items]);

  const visible = useMemo(
    () => items.filter((i) => (category === "all" || i.category === category) && matches(i, search)),
    [items, category, search],
  );

  const featured = useMemo(() => items.filter((i) => i.featured || i.popular).slice(0, 6), [items]);

  return (
    <>
      <FAQHero hero={content.hero} search={search} onSearch={setSearch} resultCount={visible.length} />

      {!searching && <FeaturedQuestions content={content.featured} items={featured} />}

      <section className="bg-cream py-16 md:py-24">
        <Container>
          <div className="max-w-2xl">
            {content.browse.eyebrow && <p className="eyebrow mb-3">{content.browse.eyebrow}</p>}
            <h2 className="text-display-md">{content.browse.heading}</h2>
            {content.browse.intro && (
              <p className="mt-4 text-lg leading-relaxed text-bark-700/80">{content.browse.intro}</p>
            )}
          </div>

          <div className="mt-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <FAQCategoryTabs categories={categories} active={category} counts={counts} onChange={setCategory} />
            <div className="lg:w-72">
              <FAQSearch value={search} onChange={setSearch} resultCount={visible.length} />
            </div>
          </div>

          <div className="mt-10 max-w-3xl">
            {visible.length > 0 ? (
              <Reveal key={`${category}|${search}`}>
                <FaqPageAccordion items={visible} highlight={search} deepLink idPrefix="faq" />
              </Reveal>
            ) : (
              <EmptySearchState query={search} onClear={() => { setSearch(""); setCategory("all"); }} />
            )}
          </div>
        </Container>
      </section>
    </>
  );
}
