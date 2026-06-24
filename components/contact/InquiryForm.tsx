"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { inquirySchema, type InquiryValues } from "@/lib/validation/inquiry";
import { submitInquiry } from "@/lib/actions/submitInquiry";
import { PROGRAM_LABELS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import Button from "@/components/ui/Button";

const fieldBase =
  "w-full rounded-card border border-forest-700/20 bg-white px-4 py-3 text-bark-700 placeholder:text-bark-700/40 outline-none transition-colors focus-visible:border-leaf-600 focus-visible:ring-2 focus-visible:ring-leaf-600/30";

const programOptions = Object.values(PROGRAM_LABELS);
const contactMethods: { value: InquiryValues["preferredContact"]; label: string }[] = [
  { value: "email", label: "Email" },
  { value: "phone", label: "Phone" },
  { value: "whatsapp", label: "WhatsApp" },
];

/**
 * Premium inquiry form — React Hook Form + Zod (shared schema with the server
 * action), real-time validation after first touch, accessible errors, and a
 * success state. Submits via the `submitInquiry` server action.
 */
export default function InquiryForm() {
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<InquiryValues>({
    resolver: zodResolver(inquirySchema),
    mode: "onTouched",
    defaultValues: { preferredContact: "email", programInterest: "" },
  });

  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [serverError, setServerError] = useState("");

  async function onSubmit(values: InquiryValues) {
    setStatus("idle");
    setServerError("");
    const res = await submitInquiry(values);
    if (res.ok) {
      setStatus("success");
      reset();
    } else {
      setStatus("error");
      setServerError(res.error);
      if (res.fieldErrors) {
        for (const [key, message] of Object.entries(res.fieldErrors)) {
          setError(key as keyof InquiryValues, { message });
        }
      }
    }
  }

  if (status === "success") {
    return (
      <div
        role="status"
        aria-live="polite"
        className="flex h-full flex-col items-center justify-center rounded-card-lg border border-leaf-600/20 bg-sage-100 p-10 text-center"
      >
        <span className="mb-5 inline-flex h-14 w-14 items-center justify-center rounded-full bg-leaf-600 text-cream">
          <svg viewBox="0 0 24 24" aria-hidden className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <path d="m5 13 4 4L19 7" />
          </svg>
        </span>
        <h3 className="text-display-sm text-forest-900">Thank you!</h3>
        <p className="mx-auto mt-3 max-w-sm text-bark-700/80">
          We&apos;ve received your message and one of our team will be in touch soon. We can&apos;t wait to welcome
          your family.
        </p>
        <div className="mt-6">
          <Button variant="ghost" onClick={() => setStatus("idle")}>
            Send another message
          </Button>
        </div>
      </div>
    );
  }

  const labelClass = "mb-1.5 block text-sm font-medium text-forest-900";
  const errClass = "mt-1 block text-sm text-clay-600";
  const errId = (name: string) => `${name}-error`;

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="parentName" className={labelClass}>
            Parent name <span className="text-clay-600">*</span>
          </label>
          <input
            id="parentName"
            autoComplete="name"
            aria-invalid={!!errors.parentName}
            aria-describedby={errors.parentName ? errId("parentName") : undefined}
            className={cn(fieldBase, errors.parentName && "border-clay-600")}
            {...register("parentName")}
          />
          {errors.parentName && <span id={errId("parentName")} className={errClass}>{errors.parentName.message}</span>}
        </div>

        <div>
          <label htmlFor="email" className={labelClass}>
            Email address <span className="text-clay-600">*</span>
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? errId("email") : undefined}
            className={cn(fieldBase, errors.email && "border-clay-600")}
            {...register("email")}
          />
          {errors.email && <span id={errId("email")} className={errClass}>{errors.email.message}</span>}
        </div>

        <div>
          <label htmlFor="phone" className={labelClass}>
            Phone number <span className="text-clay-600">*</span>
          </label>
          <input
            id="phone"
            type="tel"
            autoComplete="tel"
            aria-invalid={!!errors.phone}
            aria-describedby={errors.phone ? errId("phone") : undefined}
            className={cn(fieldBase, errors.phone && "border-clay-600")}
            {...register("phone")}
          />
          {errors.phone && <span id={errId("phone")} className={errClass}>{errors.phone.message}</span>}
        </div>

        <div>
          <label htmlFor="childAge" className={labelClass}>
            Child age <span className="text-bark-700/50">(optional)</span>
          </label>
          <input
            id="childAge"
            placeholder="e.g. 3 years"
            className={fieldBase}
            {...register("childAge")}
          />
        </div>
      </div>

      <div>
        <label htmlFor="programInterest" className={labelClass}>
          Program interest <span className="text-clay-600">*</span>
        </label>
        <select
          id="programInterest"
          aria-invalid={!!errors.programInterest}
          aria-describedby={errors.programInterest ? errId("programInterest") : undefined}
          className={cn(fieldBase, errors.programInterest && "border-clay-600")}
          {...register("programInterest")}
        >
          <option value="">Select an option…</option>
          {programOptions.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
          <option value="Not sure yet">Not sure yet</option>
        </select>
        {errors.programInterest && (
          <span id={errId("programInterest")} className={errClass}>{errors.programInterest.message}</span>
        )}
      </div>

      <div>
        <label htmlFor="message" className={labelClass}>
          Message <span className="text-clay-600">*</span>
        </label>
        <textarea
          id="message"
          rows={4}
          aria-invalid={!!errors.message}
          aria-describedby={errors.message ? errId("message") : undefined}
          className={cn(fieldBase, errors.message && "border-clay-600")}
          {...register("message")}
        />
        {errors.message && <span id={errId("message")} className={errClass}>{errors.message.message}</span>}
      </div>

      <fieldset>
        <legend className={labelClass}>
          Preferred contact method <span className="text-clay-600">*</span>
        </legend>
        <div className="flex flex-wrap gap-2">
          {contactMethods.map((m) => (
            <label
              key={m.value}
              className="cursor-pointer rounded-full border border-forest-700/20 bg-white px-4 py-2 text-sm text-forest-900 transition-colors has-[:checked]:border-leaf-600 has-[:checked]:bg-leaf-600 has-[:checked]:text-cream has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-leaf-600/40"
            >
              <input type="radio" value={m.value} className="sr-only" {...register("preferredContact")} />
              {m.label}
            </label>
          ))}
        </div>
        {errors.preferredContact && <span className={errClass}>{errors.preferredContact.message}</span>}
      </fieldset>

      {status === "error" && serverError && (
        <p role="alert" className="rounded-card border border-clay-600/30 bg-clay-600/5 px-4 py-3 text-sm text-clay-600">
          {serverError}
        </p>
      )}

      <Button type="submit" size="lg" disabled={isSubmitting} className="w-full sm:w-auto">
        {isSubmitting ? "Sending…" : "Send message"}
      </Button>
    </form>
  );
}
