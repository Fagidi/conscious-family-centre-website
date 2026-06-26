"use client";

import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registrationSchema, type RegistrationValues } from "@/lib/validation/registration";
import { submitRegistration, type RegistrationResult } from "@/lib/actions/submitRegistration";
import {
  PROGRAMME,
  PAYMENT,
  PAYMENT_OPTIONS,
  ATTENDANCE_OPTIONS,
  AGE_OPTIONS,
  TSHIRT_SIZES,
  MONTH_OPTIONS,
  WEEK_OPTIONS,
  POLICIES,
  estimateFee,
  ageIsUnder4,
} from "@/lib/futureMakers";
import { formatNaira } from "@/lib/utils";
import { cn } from "@/lib/utils";
import type { CampAgeOption, CampWeeks } from "@/lib/types";
import Button from "@/components/ui/Button";
import FaqAccordion from "@/components/faq/FaqAccordion";
import Stepper from "./Stepper";

const DRAFT_KEY = "fm-registration-draft";
const MAX_BYTES = 10 * 1024 * 1024;

const fieldBase =
  "w-full rounded-card border border-forest-700/20 bg-white px-4 py-3 text-bark-700 placeholder:text-bark-700/40 outline-none transition-colors focus-visible:border-leaf-600 focus-visible:ring-2 focus-visible:ring-leaf-600/30";
const labelClass = "mb-1.5 block text-sm font-medium text-forest-900";
const errClass = "mt-1 block text-sm text-clay-600";
const helpClass = "mt-1 block text-sm text-bark-700/60";
const req = <span className="text-clay-600"> *</span>;

const policyItems = POLICIES.map((p) => ({ question: p.title, answer: p.body, category: "general" as const }));

const fieldsByStep: Record<string, (keyof RegistrationValues)[]> = {
  parent: ["email", "parentFullName", "parentPhone", "cfcAttendanceHistory"],
  child: ["childrenFullNames", "childrenAges", "childOneGender", "tshirtSize"],
  nanny: ["nannyName", "nannyPhone"],
  programme: ["selectedMonths", "selectedWeeks", "selectedWeeksOther", "paymentOption"],
  emergency: ["emergencyContact"],
  policies: ["electronicSignature", "policyAgreement"],
};

export default function RegistrationForm() {
  const {
    register,
    handleSubmit,
    trigger,
    watch,
    reset,
    setError,
    setValue,
    formState: { errors },
  } = useForm<RegistrationValues>({
    resolver: zodResolver(registrationSchema),
    mode: "onTouched",
    defaultValues: { paymentOption: "full" },
  });

  const [step, setStep] = useState(0);
  const [childCount, setChildCount] = useState(1);
  const [childNames, setChildNames] = useState(["", "", "", "", ""]);
  const [file, setFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");
  const [result, setResult] = useState<RegistrationResult | null>(null);
  const topRef = useRef<HTMLDivElement>(null);

  // Restore / persist a local draft (excludes the uploaded file).
  useEffect(() => {
    const saved = typeof window !== "undefined" ? localStorage.getItem(DRAFT_KEY) : null;
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        reset(parsed);
        if (parsed.childrenFullNames) {
          const parts = (parsed.childrenFullNames as string).split(",").map((s: string) => s.trim());
          const filled = Math.min(Math.max(parts.length, 1), 5);
          setChildCount(filled);
          setChildNames((prev) => prev.map((_, i) => parts[i] ?? ""));
        }
      } catch {
        /* ignore corrupt draft */
      }
    }
  }, [reset]);

  const values = watch();
  useEffect(() => {
    const id = setTimeout(() => {
      try {
        localStorage.setItem(DRAFT_KEY, JSON.stringify(values));
      } catch {
        /* storage unavailable */
      }
    }, 400);
    return () => clearTimeout(id);
  }, [values]);

  const needsNanny = ageIsUnder4(watch("childrenAges") as CampAgeOption | undefined);
  const steps = [
    { key: "parent", title: "Parent" },
    { key: "child", title: "Child" },
    ...(needsNanny ? [{ key: "nanny", title: "Nanny" }] : []),
    { key: "programme", title: "Programme" },
    { key: "emergency", title: "Emergency" },
    { key: "policies", title: "Policies" },
    { key: "payment", title: "Payment" },
    { key: "review", title: "Review" },
  ];
  const currentKey = steps[Math.min(step, steps.length - 1)].key;

  const fee = estimateFee(watch("childrenAges") as CampAgeOption, watch("selectedWeeks") as CampWeeks);
  const feeLabel = fee !== null ? formatNaira(fee) : "Fee to be confirmed by Conscious Family Centre";

  function scrollTop() {
    topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function validateFile(): boolean {
    if (!file) return setFileError("Please upload your proof of payment."), false;
    const okType = file.type.startsWith("image/") || file.type === "application/pdf";
    if (!okType) return setFileError("Please upload an image or PDF."), false;
    if (file.size > MAX_BYTES) return setFileError("Maximum file size is 10MB."), false;
    setFileError("");
    return true;
  }

  async function next() {
    if (currentKey === "payment") {
      if (!validateFile()) return;
    } else if (fieldsByStep[currentKey]) {
      const ok = await trigger(fieldsByStep[currentKey]);
      if (!ok) return;
    }
    setStep((s) => Math.min(s + 1, steps.length - 1));
    scrollTop();
  }

  function back() {
    setStep((s) => Math.max(s - 1, 0));
    scrollTop();
  }

  function goTo(key: string) {
    const i = steps.findIndex((s) => s.key === key);
    if (i >= 0) {
      setStep(i);
      scrollTop();
    }
  }

  async function onValid(data: RegistrationValues) {
    if (!validateFile() || !file) {
      goTo("payment");
      return;
    }
    setSubmitting(true);
    setServerError("");
    const fd = new FormData();
    fd.append("data", JSON.stringify(data));
    fd.append("proof", file);
    const res = await submitRegistration(fd);
    setSubmitting(false);
    if (res.ok) {
      setResult(res.data);
      try {
        localStorage.removeItem(DRAFT_KEY);
      } catch {
        /* ignore */
      }
      scrollTop();
    } else {
      setServerError(res.error);
      if (res.fieldErrors) {
        for (const [k, m] of Object.entries(res.fieldErrors)) {
          if (k === "proof") setFileError(m);
          else setError(k as keyof RegistrationValues, { message: m });
        }
      }
    }
  }

  /* ── Success screen ─────────────────────────────────────────── */
  if (result) {
    return (
      <div ref={topRef} className="rounded-card-lg border border-leaf-600/20 bg-sage-100 p-8 text-center md:p-12">
        <span className="mb-5 inline-flex h-14 w-14 items-center justify-center rounded-full bg-leaf-600 text-cream">
          <svg viewBox="0 0 24 24" aria-hidden className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <path d="m5 13 4 4L19 7" />
          </svg>
        </span>
        <h2 className="text-display-sm text-forest-900">Thank you for registering!</h2>
        <p className="mx-auto mt-3 max-w-lg text-bark-700/85">
          Your registration for the Future Makers Summer Experience 2026 has been received. Registration is only
          confirmed once payment has been reviewed and received — we&apos;ll be in touch soon.
        </p>
        <dl className="mx-auto mt-6 grid max-w-md gap-3 text-left">
          <div className="flex justify-between gap-4 rounded-card bg-white px-4 py-3">
            <dt className="text-bark-700/70">Registration ID</dt>
            <dd className="font-semibold text-forest-900">{result.registrationId}</dd>
          </div>
          <div className="flex justify-between gap-4 rounded-card bg-white px-4 py-3">
            <dt className="text-bark-700/70">Estimated fee</dt>
            <dd className="font-semibold text-forest-900">{result.feeLabel}</dd>
          </div>
        </dl>
        <div className="mx-auto mt-6 max-w-md rounded-card border border-forest-700/10 bg-white p-5 text-left text-sm text-bark-700/80">
          <p className="font-semibold text-forest-900">Next steps</p>
          <ol className="mt-2 list-decimal space-y-1 pl-5">
            <li>We review your proof of payment.</li>
            <li>We confirm your child&apos;s place by email.</li>
            <li>You&apos;ll receive everything you need before the first day.</li>
          </ol>
          <p className="mt-4">
            Questions? Call {PROGRAMME.centre} on{" "}
            <a href="tel:+2348035183784" className="font-medium text-leaf-600">
              +234 803 518 3784
            </a>{" "}
            or visit our{" "}
            <a href="/contact" className="font-medium text-leaf-600">
              contact page
            </a>
            .
          </p>
        </div>
      </div>
    );
  }

  /* ── Form ───────────────────────────────────────────────────── */
  return (
    <div ref={topRef} className="rounded-card-lg border border-forest-700/10 bg-white p-6 shadow-soft md:p-8">
      <Stepper steps={steps} current={step} />

      <form onSubmit={handleSubmit(onValid)} noValidate className="mt-8 space-y-6">
        {/* STEP: Parent */}
        {currentKey === "parent" && (
          <fieldset className="space-y-5">
            <legend className="text-display-sm text-forest-900">Parent information</legend>
            <div>
              <label htmlFor="email" className={labelClass}>Email address{req}</label>
              <input id="email" type="email" autoComplete="email" className={cn(fieldBase, errors.email && "border-clay-600")} {...register("email")} />
              {errors.email && <span className={errClass}>{errors.email.message}</span>}
            </div>
            <div>
              <label htmlFor="parentFullName" className={labelClass}>Parent&apos;s full name{req}</label>
              <input id="parentFullName" autoComplete="name" className={cn(fieldBase, errors.parentFullName && "border-clay-600")} {...register("parentFullName")} />
              {errors.parentFullName && <span className={errClass}>{errors.parentFullName.message}</span>}
            </div>
            <div>
              <label htmlFor="parentPhone" className={labelClass}>Parent&apos;s phone number{req}</label>
              <input id="parentPhone" type="tel" autoComplete="tel" className={cn(fieldBase, errors.parentPhone && "border-clay-600")} {...register("parentPhone")} />
              {errors.parentPhone && <span className={errClass}>{errors.parentPhone.message}</span>}
            </div>
            <fieldset>
              <legend className={labelClass}>Have you attended Conscious Family Centre before?{req}</legend>
              <div className="mt-1 space-y-2">
                {ATTENDANCE_OPTIONS.map((o) => (
                  <label key={o.value} className="flex cursor-pointer items-start gap-3 rounded-card border border-forest-700/15 bg-white p-3 text-sm has-[:checked]:border-leaf-600 has-[:checked]:bg-leaf-600/5">
                    <input type="radio" value={o.value} className="mt-0.5 accent-leaf-600" {...register("cfcAttendanceHistory")} />
                    <span className="text-bark-700/90">{o.label}</span>
                  </label>
                ))}
              </div>
              {errors.cfcAttendanceHistory && <span className={errClass}>{errors.cfcAttendanceHistory.message}</span>}
            </fieldset>
          </fieldset>
        )}

        {/* STEP: Child */}
        {currentKey === "child" && (
          <fieldset className="space-y-6">
            <legend className="text-display-sm text-forest-900">Child information</legend>

            {/* Hidden field keeps childrenFullNames registered with RHF */}
            <input type="hidden" {...register("childrenFullNames")} />

            {/* ── How many children ── */}
            <div>
              <label htmlFor="childCount" className={labelClass}>How many children are you registering?{req}</label>
              <select
                id="childCount"
                className={fieldBase}
                value={childCount}
                onChange={(e) => {
                  const n = Number(e.target.value);
                  setChildCount(n);
                  // Clear names beyond the new count
                  setChildNames((prev) => prev.map((v, i) => (i < n ? v : "")));
                  // Clear child 2 gender if dropping to 1
                  if (n < 2) setValue("childTwoGender", null);
                  // Sync combined names
                  const combined = childNames.slice(0, n).filter(Boolean).join(", ");
                  setValue("childrenFullNames", combined, { shouldValidate: !!childNames[0] });
                }}
              >
                {[1, 2, 3, 4, 5].map((n) => (
                  <option key={n} value={n}>{n} {n === 1 ? "child" : "children"}</option>
                ))}
              </select>
            </div>

            {/* ── Per-child cards ── */}
            {Array.from({ length: childCount }, (_, i) => {
              const isFirst = i === 0;
              const hasGenderField = i <= 1;
              const genderField = (i === 0 ? "childOneGender" : "childTwoGender") as keyof RegistrationValues;
              const nameError = isFirst ? errors.childrenFullNames : undefined;
              const genderError = isFirst ? errors.childOneGender : undefined;

              return (
                <div key={i} className="space-y-4 rounded-card-lg border border-forest-700/10 bg-white p-5 shadow-soft">
                  {/* Card header */}
                  <div className="flex items-center gap-3 border-b border-forest-700/8 pb-4">
                    <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-leaf-600 text-sm font-semibold text-cream">
                      {i + 1}
                    </span>
                    <span className="font-medium text-forest-900">
                      {childCount === 1 ? "Child details" : `Child ${i + 1}`}
                    </span>
                  </div>

                  {/* Name */}
                  <div>
                    <label htmlFor={`childName-${i}`} className={labelClass}>
                      Full name{req}
                    </label>
                    <input
                      id={`childName-${i}`}
                      className={cn(fieldBase, nameError && "border-clay-600")}
                      placeholder="Enter child's full name"
                      value={childNames[i]}
                      onChange={(e) => {
                        const updated = childNames.map((v, idx) => (idx === i ? e.target.value : v));
                        setChildNames(updated);
                        const combined = updated.slice(0, childCount).filter(Boolean).join(", ");
                        setValue("childrenFullNames", combined, { shouldValidate: true });
                      }}
                    />
                    {nameError && <span className={errClass}>{nameError.message}</span>}
                  </div>

                  {/* Gender — only child 1 (required) and child 2 (optional) are in the schema */}
                  {hasGenderField && (
                    <fieldset>
                      <legend className={labelClass}>
                        Gender{isFirst ? req : <span className="text-bark-700/50 ml-1">(optional)</span>}
                      </legend>
                      <div className="flex gap-2">
                        {["male", "female"].map((g) => (
                          <label
                            key={g}
                            className="flex-1 cursor-pointer rounded-card border border-forest-700/15 bg-white px-4 py-2.5 text-center text-sm capitalize has-[:checked]:border-leaf-600 has-[:checked]:bg-leaf-600 has-[:checked]:text-cream"
                          >
                            <input type="radio" value={g} className="sr-only" {...register(genderField)} />
                            {g}
                          </label>
                        ))}
                      </div>
                      {genderError && <span className={errClass}>{genderError.message}</span>}
                    </fieldset>
                  )}
                </div>
              );
            })}

            {/* ── Shared programme details ── */}
            <div className="space-y-5 rounded-card-lg border border-forest-700/10 bg-sage-100/60 p-5">
              <p className="text-xs font-semibold uppercase tracking-wide text-bark-700/50">Programme details</p>

              <div>
                <label htmlFor="childrenAges" className={labelClass}>
                  {childCount === 1 ? "Child's age" : "Age group (youngest child)"}{req}
                </label>
                <select
                  id="childrenAges"
                  className={cn(fieldBase, errors.childrenAges && "border-clay-600")}
                  defaultValue=""
                  {...register("childrenAges")}
                >
                  <option value="" disabled>Select an age…</option>
                  {AGE_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
                {childCount > 1 && <span className={helpClass}>Fees are based on the youngest child's age group.</span>}
                {errors.childrenAges && <span className={errClass}>{errors.childrenAges.message}</span>}
              </div>

              <div>
                <label htmlFor="tshirtSize" className={labelClass}>Camp T-shirt size{req}</label>
                <select
                  id="tshirtSize"
                  className={cn(fieldBase, errors.tshirtSize && "border-clay-600")}
                  defaultValue=""
                  {...register("tshirtSize")}
                >
                  <option value="" disabled>Select a size…</option>
                  {TSHIRT_SIZES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
                {childCount > 1 && (
                  <span className={helpClass}>Contact us to confirm T-shirt sizes for additional children.</span>
                )}
                {errors.tshirtSize && <span className={errClass}>{errors.tshirtSize.message}</span>}
              </div>
            </div>
          </fieldset>
        )}

        {/* STEP: Nanny (conditional) */}
        {currentKey === "nanny" && (
          <fieldset className="space-y-5">
            <legend className="text-display-sm text-forest-900">Nanny information</legend>
            <p className="rounded-card bg-sage-100 px-4 py-3 text-sm text-bark-700/80">
              Children under 4 years must attend with a parent or nanny.
            </p>
            <div>
              <label htmlFor="nannyName" className={labelClass}>Nanny&apos;s name{req}</label>
              <input id="nannyName" className={cn(fieldBase, errors.nannyName && "border-clay-600")} {...register("nannyName")} />
              {errors.nannyName && <span className={errClass}>{errors.nannyName.message}</span>}
            </div>
            <div>
              <label htmlFor="nannyPhone" className={labelClass}>Nanny&apos;s phone number{req}</label>
              <input id="nannyPhone" type="tel" className={cn(fieldBase, errors.nannyPhone && "border-clay-600")} {...register("nannyPhone")} />
              {errors.nannyPhone && <span className={errClass}>{errors.nannyPhone.message}</span>}
            </div>
          </fieldset>
        )}

        {/* STEP: Programme */}
        {currentKey === "programme" && (
          <fieldset className="space-y-5">
            <legend className="text-display-sm text-forest-900">Programme selection</legend>
            <fieldset>
              <legend className={labelClass}>Select month(s) of registration{req}</legend>
              <div className="flex flex-wrap gap-2">
                {MONTH_OPTIONS.map((o) => (
                  <label key={o.value} className="cursor-pointer rounded-full border border-forest-700/15 bg-white px-4 py-2 text-sm has-[:checked]:border-leaf-600 has-[:checked]:bg-leaf-600 has-[:checked]:text-cream">
                    <input type="radio" value={o.value} className="sr-only" {...register("selectedMonths")} />
                    {o.label}
                  </label>
                ))}
              </div>
              {errors.selectedMonths && <span className={errClass}>{errors.selectedMonths.message}</span>}
            </fieldset>
            <fieldset>
              <legend className={labelClass}>How many weeks will your child join us?{req}</legend>
              <div className="flex flex-wrap gap-2">
                {WEEK_OPTIONS.map((o) => (
                  <label key={o.value} className="cursor-pointer rounded-full border border-forest-700/15 bg-white px-4 py-2 text-sm has-[:checked]:border-leaf-600 has-[:checked]:bg-leaf-600 has-[:checked]:text-cream">
                    <input type="radio" value={o.value} className="sr-only" {...register("selectedWeeks")} />
                    {o.label}
                  </label>
                ))}
              </div>
              {errors.selectedWeeks && <span className={errClass}>{errors.selectedWeeks.message}</span>}
            </fieldset>
            {watch("selectedWeeks") === "other" && (
              <div>
                <label htmlFor="selectedWeeksOther" className={labelClass}>Please specify{req}</label>
                <input id="selectedWeeksOther" className={cn(fieldBase, errors.selectedWeeksOther && "border-clay-600")} {...register("selectedWeeksOther")} />
                {errors.selectedWeeksOther && <span className={errClass}>{errors.selectedWeeksOther.message}</span>}
              </div>
            )}
            <fieldset>
              <legend className={labelClass}>Payment option{req}</legend>
              <div className="flex flex-wrap gap-2">
                {PAYMENT_OPTIONS.map((o) => (
                  <label key={o.value} className="cursor-pointer rounded-full border border-forest-700/15 bg-white px-4 py-2 text-sm has-[:checked]:border-leaf-600 has-[:checked]:bg-leaf-600 has-[:checked]:text-cream">
                    <input type="radio" value={o.value} className="sr-only" {...register("paymentOption")} />
                    {o.label}
                  </label>
                ))}
              </div>
              {errors.paymentOption && <span className={errClass}>{errors.paymentOption.message}</span>}
            </fieldset>
            <div className="rounded-card bg-sage-100 px-4 py-4">
              <p className="text-sm text-bark-700/70">Estimated fee</p>
              <p className="text-xl font-semibold text-forest-900">{feeLabel}</p>
            </div>
          </fieldset>
        )}

        {/* STEP: Emergency */}
        {currentKey === "emergency" && (
          <fieldset className="space-y-5">
            <legend className="text-display-sm text-forest-900">Emergency contact</legend>
            <div>
              <label htmlFor="emergencyContact" className={labelClass}>Emergency contact{req}</label>
              <textarea id="emergencyContact" rows={3} className={cn(fieldBase, errors.emergencyContact && "border-clay-600")} placeholder="Contact name and phone number" {...register("emergencyContact")} />
              <span className={helpClass}>Kindly provide a contact name and phone number.</span>
              {errors.emergencyContact && <span className={errClass}>{errors.emergencyContact.message}</span>}
            </div>
          </fieldset>
        )}

        {/* STEP: Policies */}
        {currentKey === "policies" && (
          <fieldset className="space-y-5">
            <legend className="text-display-sm text-forest-900">Policies &amp; parent agreement</legend>
            <FaqAccordion items={policyItems} />
            <label className="flex cursor-pointer items-start gap-3 rounded-card border border-forest-700/15 bg-sage-100 p-4 text-sm has-[:checked]:border-leaf-600">
              <input type="checkbox" className="mt-0.5 h-5 w-5 accent-leaf-600" {...register("policyAgreement")} />
              <span className="text-bark-700/90">
                I confirm that I have read and agree to the Future Makers Summer Experience Policies and Parent
                Agreement. I understand that registration is only confirmed upon payment.
              </span>
            </label>
            {errors.policyAgreement && <span className={errClass}>{errors.policyAgreement.message}</span>}
            <div>
              <label htmlFor="electronicSignature" className={labelClass}>Parent/Guardian full name (electronic signature){req}</label>
              <input id="electronicSignature" className={cn(fieldBase, errors.electronicSignature && "border-clay-600")} placeholder="Type your full name" {...register("electronicSignature")} />
              {errors.electronicSignature && <span className={errClass}>{errors.electronicSignature.message}</span>}
            </div>
          </fieldset>
        )}

        {/* STEP: Payment proof */}
        {currentKey === "payment" && (
          <fieldset className="space-y-5">
            <legend className="text-display-sm text-forest-900">Payment &amp; proof of payment</legend>
            <div className="rounded-card border border-forest-700/10 bg-sage-100 p-5">
              <p className="text-sm font-semibold uppercase tracking-wide text-bark-700/55">Bank transfer details</p>
              <dl className="mt-3 space-y-1.5 text-sm">
                <div className="flex justify-between gap-4"><dt className="text-bark-700/70">Account name</dt><dd className="font-medium text-forest-900">{PAYMENT.accountName}</dd></div>
                <div className="flex justify-between gap-4"><dt className="text-bark-700/70">Account number</dt><dd className="font-medium text-forest-900">{PAYMENT.accountNumber}</dd></div>
                <div className="flex justify-between gap-4"><dt className="text-bark-700/70">Bank</dt><dd className="font-medium text-forest-900">{PAYMENT.bank}</dd></div>
              </dl>
            </div>
            <div>
              <label htmlFor="proof" className={labelClass}>Upload proof of payment{req}</label>
              <input
                id="proof"
                type="file"
                accept="image/*,application/pdf"
                onChange={(e) => {
                  setFile(e.target.files?.[0] ?? null);
                  setFileError("");
                }}
                className="block w-full text-sm text-bark-700 file:mr-4 file:rounded-full file:border-0 file:bg-leaf-600 file:px-4 file:py-2 file:text-sm file:font-medium file:text-cream hover:file:bg-forest-700"
              />
              <span className={helpClass}>Image or PDF, maximum 10MB.</span>
              {file && <span className="mt-1 block text-sm text-bark-700/80">Selected: {file.name} ({(file.size / 1024 / 1024).toFixed(1)}MB)</span>}
              {fileError && <span className={errClass}>{fileError}</span>}
            </div>
          </fieldset>
        )}

        {/* STEP: Review */}
        {currentKey === "review" && (
          <div className="space-y-5">
            <h2 className="text-display-sm text-forest-900">Review &amp; submit</h2>
            <p className="text-bark-700/80">Please check your details. You can go back to any section to edit.</p>
            <dl className="divide-y divide-forest-700/10 rounded-card border border-forest-700/10">
              {[
                ["Email", values.email, "parent"],
                ["Parent", values.parentFullName, "parent"],
                ["Phone", values.parentPhone, "parent"],
                ["Child(ren)", values.childrenFullNames, "child"],
                ["Age", AGE_OPTIONS.find((a) => a.value === values.childrenAges)?.label, "child"],
                ["T-shirt size", values.tshirtSize, "child"],
                ...(needsNanny ? [["Nanny", `${values.nannyName ?? ""} ${values.nannyPhone ?? ""}`, "nanny"] as const] : []),
                ["Months", MONTH_OPTIONS.find((m) => m.value === values.selectedMonths)?.label, "programme"],
                ["Weeks", values.selectedWeeks === "other" ? values.selectedWeeksOther : WEEK_OPTIONS.find((w) => w.value === values.selectedWeeks)?.label, "programme"],
                ["Payment option", PAYMENT_OPTIONS.find((p) => p.value === values.paymentOption)?.label, "programme"],
                ["Estimated fee", feeLabel, "programme"],
                ["Emergency contact", values.emergencyContact, "emergency"],
                ["Signature", values.electronicSignature, "policies"],
                ["Proof of payment", file ? file.name : "Not uploaded", "payment"],
              ].map(([label, value, target]) => (
                <div key={label as string} className="flex items-start justify-between gap-4 px-4 py-3">
                  <dt className="text-sm text-bark-700/65">{label}</dt>
                  <dd className="flex items-center gap-3 text-right text-sm text-forest-900">
                    <span>{(value as string) || "—"}</span>
                    <button type="button" onClick={() => goTo(target as string)} className="shrink-0 text-xs font-medium text-leaf-600 hover:underline">
                      Edit
                    </button>
                  </dd>
                </div>
              ))}
            </dl>
            <p className="rounded-card bg-sage-100 px-4 py-3 text-sm text-bark-700/80">
              Registration is only confirmed once payment has been reviewed and received.
            </p>
            {serverError && (
              <p role="alert" className="rounded-card border border-clay-600/30 bg-clay-600/5 px-4 py-3 text-sm text-clay-600">
                {serverError}
              </p>
            )}
          </div>
        )}

        {/* Nav */}
        <div className="flex items-center justify-between gap-3 border-t border-forest-700/10 pt-6">
          <Button type="button" variant="ghost" onClick={back} disabled={step === 0} className={step === 0 ? "invisible" : undefined}>
            Back
          </Button>
          {currentKey === "review" ? (
            <Button type="submit" size="lg" disabled={submitting}>
              {submitting ? "Submitting…" : "Submit registration"}
            </Button>
          ) : (
            <Button type="button" size="lg" onClick={next}>
              Continue
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}
