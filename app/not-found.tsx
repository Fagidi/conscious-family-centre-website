import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-cream px-6 text-center">
      <p className="eyebrow mb-6">Off the trail</p>
      <h1 className="text-display-lg">
        This page wandered
        <br />
        <span className="italic text-leaf-600">into the woods.</span>
      </h1>
      <p className="mt-6 max-w-sm text-bark-700/80">
        The page you&rsquo;re looking for doesn&rsquo;t exist — let&rsquo;s get you back.
      </p>
      <Link
        href="/"
        className="mt-10 inline-flex items-center gap-2 rounded-full bg-leaf-500 px-6 py-3 text-sm font-medium text-cream transition-colors hover:bg-leaf-600"
      >
        Return Home
      </Link>
    </div>
  );
}
