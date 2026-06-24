"use client";

import { useEffect, useMemo, useState } from "react";
import type { GalleryCategory, GalleryItem, GalleryPageContent } from "@/lib/types";
import Container from "@/components/ui/Container";
import GalleryFilter from "./GalleryFilter";
import GallerySearch from "./GallerySearch";
import GalleryGrid from "./GalleryGrid";
import GalleryLightbox from "./GalleryLightbox";

interface MasonryGalleryProps {
  content: GalleryPageContent["gallery"];
  items: GalleryItem[];
  categories: GalleryCategory[];
}

function matchesSearch(item: GalleryItem, q: string): boolean {
  if (!q) return true;
  const haystack = [
    item.title,
    item.caption,
    item.description,
    item.category?.title,
    item.program,
    ...(item.tags ?? []),
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
  return haystack.includes(q.toLowerCase());
}

/**
 * The dynamic gallery: category filter + search + masonry grid + accessible
 * lightbox. All client-side over CMS-driven data, so filtering/search is
 * instant. The grid remounts on filter/search change for a smooth re-stagger.
 */
export default function MasonryGallery({ content, items, categories }: MasonryGalleryProps) {
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [lightbox, setLightbox] = useState<number | null>(null);

  const visible = useMemo(
    () =>
      items.filter(
        (item) => (filter === "all" || item.category?.slug === filter) && matchesSearch(item, search),
      ),
    [items, filter, search],
  );

  // Keyboard control + body-scroll lock while the lightbox is open.
  useEffect(() => {
    if (lightbox === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightbox(null);
      if (e.key === "ArrowRight") setLightbox((n) => (n === null ? n : (n + 1) % visible.length));
      if (e.key === "ArrowLeft") setLightbox((n) => (n === null ? n : (n - 1 + visible.length) % visible.length));
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [lightbox, visible.length]);

  const changeFilter = (value: string) => {
    setFilter(value);
    setLightbox(null);
  };
  const changeSearch = (value: string) => {
    setSearch(value);
    setLightbox(null);
  };

  if (items.length === 0) return null;
  const current = lightbox === null ? null : visible[lightbox] ?? null;

  return (
    <section className="bg-cream py-16 md:py-24">
      <Container>
        <div className="max-w-2xl">
          {content.eyebrow && <p className="eyebrow mb-3">{content.eyebrow}</p>}
          <h2 className="text-display-md">{content.heading}</h2>
          {content.intro && <p className="mt-4 text-lg leading-relaxed text-bark-700/80">{content.intro}</p>}
        </div>

        <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <GalleryFilter categories={categories} active={filter} onChange={changeFilter} />
          <GallerySearch value={search} onChange={changeSearch} resultCount={visible.length} />
        </div>

        <div className="mt-10">
          {visible.length > 0 ? (
            <GalleryGrid key={`${filter}|${search}`} items={visible} onOpen={setLightbox} />
          ) : (
            <p className="py-16 text-center text-bark-700/70">
              No moments match your search yet. Try a different category or term.
            </p>
          )}
        </div>
      </Container>

      <GalleryLightbox
        item={current}
        hasNav={visible.length > 1}
        onClose={() => setLightbox(null)}
        onPrev={() => setLightbox((n) => (n === null ? n : (n - 1 + visible.length) % visible.length))}
        onNext={() => setLightbox((n) => (n === null ? n : (n + 1) % visible.length))}
      />
    </section>
  );
}
