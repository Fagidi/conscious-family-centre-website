"use client";

interface GallerySearchProps {
  value: string;
  onChange: (value: string) => void;
  resultCount: number;
}

/** Accessible search input for the gallery (presentational). */
export default function GallerySearch({ value, onChange, resultCount }: GallerySearchProps) {
  return (
    <div className="relative w-full sm:w-72">
      <label htmlFor="gallery-search" className="sr-only">
        Search the gallery
      </label>
      <svg
        viewBox="0 0 24 24"
        aria-hidden
        className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-bark-700/50"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-3-3" />
      </svg>
      <input
        id="gallery-search"
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search moments…"
        aria-describedby="gallery-search-count"
        className="w-full rounded-full border border-forest-700/15 bg-white py-2.5 pl-10 pr-4 text-sm text-forest-900 shadow-soft outline-none transition-colors placeholder:text-bark-700/40 focus-visible:border-leaf-600 focus-visible:ring-2 focus-visible:ring-leaf-600/40"
      />
      <span id="gallery-search-count" role="status" className="sr-only">
        {resultCount} {resultCount === 1 ? "image" : "images"} found
      </span>
    </div>
  );
}
