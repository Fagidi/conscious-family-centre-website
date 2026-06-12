import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-noir px-6 text-center">
      <p className="eyebrow mb-8">Lost the thread</p>
      <h1 className="font-display text-display-lg font-light">
        This moment
        <br />
        <span className="italic text-amethyst-bright">slipped away.</span>
      </h1>
      <p className="mt-8 max-w-sm text-sm font-light leading-relaxed text-ivory-dim">
        The page you&rsquo;re looking for doesn&rsquo;t exist — but the evening is young.
      </p>
      <Link
        href="/"
        className="group mt-12 inline-flex items-center gap-3 border-b border-amethyst pb-2 text-[0.7rem] font-medium uppercase tracking-[0.3em] text-ivory transition-colors duration-500 hover:text-amethyst-bright"
      >
        Return Home
        <span aria-hidden className="transition-transform duration-500 group-hover:translate-x-2">→</span>
      </Link>
    </div>
  );
}
