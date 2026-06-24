"use client";

import { useState } from "react";
import { subscribeNewsletter } from "@/lib/actions/subscribeNewsletter";

/** Newsletter capture (placeholder transport — wires to subscribeNewsletter). */
export default function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [message, setMessage] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setState("loading");
    const res = await subscribeNewsletter({ email });
    if (res.ok) {
      setState("done");
      setMessage("Thanks — you're on the list.");
      setEmail("");
    } else {
      setState("error");
      setMessage(res.error);
    }
  }

  return (
    <form onSubmit={onSubmit} className="mt-3">
      <label htmlFor="newsletter-email" className="sr-only">
        Email address
      </label>
      <div className="flex gap-2">
        <input
          id="newsletter-email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@email.com"
          className="w-full rounded-full bg-cream/10 px-4 py-2.5 text-sm text-cream placeholder:text-cream/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sun-400"
        />
        <button
          type="submit"
          disabled={state === "loading"}
          className="shrink-0 rounded-full bg-sun-400 px-4 py-2.5 text-sm font-semibold text-forest-900 transition-opacity hover:opacity-90 disabled:opacity-60"
        >
          {state === "loading" ? "…" : "Sign up"}
        </button>
      </div>
      {message && (
        <p aria-live="polite" className={state === "error" ? "mt-2 text-sm text-sun-400" : "mt-2 text-sm text-cream/80"}>
          {message}
        </p>
      )}
    </form>
  );
}
