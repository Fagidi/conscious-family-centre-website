import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

const fieldBase =
  "w-full rounded-card border border-forest-700/20 bg-white px-4 py-3 text-bark-700 placeholder:text-bark-700/40 focus-visible:border-leaf-500 focus-visible:outline-none";

interface LabelWrapProps {
  label: string;
  name: string;
  required?: boolean;
  error?: string;
  children: ReactNode;
}

/** Shared label + error envelope used by every form control. */
function LabelWrap({ label, name, required, error, children }: LabelWrapProps) {
  return (
    <label htmlFor={name} className="block">
      <span className="mb-1.5 block text-sm font-medium text-forest-900">
        {label}
        {required && <span className="text-danger"> *</span>}
      </span>
      {children}
      {error && <span className="mt-1 block text-sm text-danger">{error}</span>}
    </label>
  );
}

type InputFieldProps = { label: string; error?: string } & InputHTMLAttributes<HTMLInputElement>;
export function Field({ label, error, name, required, className, ...rest }: InputFieldProps) {
  return (
    <LabelWrap label={label} name={name!} required={required} error={error}>
      <input id={name} name={name} required={required} className={cn(fieldBase, className)} {...rest} />
    </LabelWrap>
  );
}

type TextareaFieldProps = { label: string; error?: string } & TextareaHTMLAttributes<HTMLTextAreaElement>;
export function TextareaField({ label, error, name, required, className, ...rest }: TextareaFieldProps) {
  return (
    <LabelWrap label={label} name={name!} required={required} error={error}>
      <textarea id={name} name={name} required={required} rows={4} className={cn(fieldBase, className)} {...rest} />
    </LabelWrap>
  );
}

type SelectFieldProps = { label: string; error?: string } & SelectHTMLAttributes<HTMLSelectElement>;
export function SelectField({ label, error, name, required, className, children, ...rest }: SelectFieldProps) {
  return (
    <LabelWrap label={label} name={name!} required={required} error={error}>
      <select id={name} name={name} required={required} className={cn(fieldBase, className)} {...rest}>
        {children}
      </select>
    </LabelWrap>
  );
}
