import { whatsappLink } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface WhatsAppCTAProps {
  phone: string;
  message?: string;
  label?: string;
  className?: string;
}

/** Low-friction WhatsApp deep link — the fallback CTA on every journey. */
export default function WhatsAppCTA({ phone, message, label = "Chat on WhatsApp", className }: WhatsAppCTAProps) {
  return (
    <a
      href={whatsappLink(phone, message)}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "inline-flex items-center gap-2 rounded-full bg-leaf-500 px-5 py-3 text-sm font-medium text-cream transition-colors hover:bg-leaf-600",
        className,
      )}
    >
      {label}
    </a>
  );
}
