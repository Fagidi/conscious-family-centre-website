"use client";

import { useState, type FormEvent } from "react";

interface ContactFormProps {
  eventTypes: string[];
}

type Status = "idle" | "submitting" | "success" | "error";

const inputClasses =
  "w-full border-b border-noir-line bg-transparent py-4 text-base font-light text-ivory placeholder:text-ivory-faint transition-colors duration-500 focus:border-amethyst focus:outline-none";

const labelClasses = "mb-2 block text-[0.64rem] font-medium uppercase tracking-[0.28em] text-ivory-dim";

/**
 * Booking inquiry form, wired to Netlify Forms via the static
 * /__forms.html detection file. Degrades to mailto on error.
 */
export default function ContactForm({ eventTypes }: ContactFormProps) {
  const [status, setStatus] = useState<Status>("idle");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");

    const form = e.currentTarget;
    const data = new FormData(form);

    try {
      const res = await fetch("/__forms.html", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams(data as unknown as Record<string, string>).toString(),
      });
      if (!res.ok) throw new Error(`Form submit failed: ${res.status}`);
      setStatus("success");
      form.reset();
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="border border-noir-line p-12 text-center md:p-16">
        <p className="font-display text-3xl font-light italic text-amethyst-bright">
          Thank you.
        </p>
        <p className="mt-6 text-sm font-light leading-relaxed text-ivory-dim">
          Your inquiry has arrived. We&rsquo;ll respond within one business day with
          availability and a tailored proposal.
        </p>
      </div>
    );
  }

  return (
    <form name="booking-inquiry" onSubmit={handleSubmit} className="space-y-9">
      <input type="hidden" name="form-name" value="booking-inquiry" />
      {/* honeypot */}
      <p className="hidden">
        <label>
          Don&rsquo;t fill this out: <input name="bot-field" />
        </label>
      </p>

      <div className="grid grid-cols-1 gap-9 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className={labelClasses}>
            Full Name *
          </label>
          <input id="name" name="name" type="text" required placeholder="Your name" className={inputClasses} />
        </div>
        <div>
          <label htmlFor="email" className={labelClasses}>
            Email *
          </label>
          <input id="email" name="email" type="email" required placeholder="you@example.com" className={inputClasses} />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-9 sm:grid-cols-2">
        <div>
          <label htmlFor="phone" className={labelClasses}>
            Phone
          </label>
          <input id="phone" name="phone" type="tel" placeholder="(516) 555-0100" className={inputClasses} />
        </div>
        <div>
          <label htmlFor="eventDate" className={labelClasses}>
            Event Date
          </label>
          <input id="eventDate" name="eventDate" type="date" className={inputClasses} />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-9 sm:grid-cols-2">
        <div>
          <label htmlFor="eventType" className={labelClasses}>
            Event Type *
          </label>
          <select id="eventType" name="eventType" required defaultValue="" className={`${inputClasses} appearance-none [&>option]:bg-noir`}>
            <option value="" disabled>
              Select one
            </option>
            {eventTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="venue" className={labelClasses}>
            Venue / Location
          </label>
          <input id="venue" name="venue" type="text" placeholder="Venue name or town" className={inputClasses} />
        </div>
      </div>

      <div>
        <label htmlFor="message" className={labelClasses}>
          Tell Us About Your Event
        </label>
        <textarea
          id="message"
          name="message"
          rows={4}
          placeholder="Guest count, the feeling you're after, anything that matters…"
          className={`${inputClasses} resize-none`}
        />
      </div>

      <div className="flex flex-col gap-5 pt-2 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="submit"
          disabled={status === "submitting"}
          className="group inline-flex items-center gap-3 bg-amethyst px-9 py-4 text-[0.72rem] font-medium uppercase tracking-[0.28em] text-white transition-colors duration-500 ease-luxe hover:bg-amethyst-deep disabled:opacity-50"
        >
          {status === "submitting" ? "Sending…" : "Send Inquiry"}
          <span aria-hidden className="transition-transform duration-500 ease-luxe group-hover:translate-x-1.5">
            →
          </span>
        </button>
        <p className="text-[0.66rem] uppercase tracking-[0.22em] text-ivory-faint">
          Response within one business day
        </p>
      </div>

      {status === "error" && (
        <p className="text-sm font-light text-amethyst-bright">
          Something went wrong. Please email us directly at{" "}
          <a href="mailto:hello@saraiphotobooth.com" className="link-underline">
            hello@saraiphotobooth.com
          </a>
          .
        </p>
      )}
    </form>
  );
}
