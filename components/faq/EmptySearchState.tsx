import Button from "@/components/ui/Button";

/** Friendly empty state when a search/filter returns no questions. */
export default function EmptySearchState({ query, onClear }: { query: string; onClear?: () => void }) {
  return (
    <div className="rounded-card-lg border border-forest-700/10 bg-white p-10 text-center shadow-soft">
      <p className="text-lg text-forest-900">
        {query ? (
          <>
            No questions match <span className="font-semibold">“{query}”</span>.
          </>
        ) : (
          "No questions here yet."
        )}
      </p>
      <p className="mx-auto mt-2 max-w-prose text-bark-700/70">
        Try a different topic or term — or just ask us directly, we&apos;re happy to help.
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        {onClear && (
          <Button onClick={onClear} variant="ghost">
            Clear search
          </Button>
        )}
        <Button href="/contact">Contact Us</Button>
      </div>
    </div>
  );
}
