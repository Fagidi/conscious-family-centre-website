import { whatsappLink } from "@/lib/utils";

interface Props {
  whatsapp: string;
}

/** Mobile-only sticky action bar: WhatsApp (low-friction) + Register. */
export default function StickyMobileActionBar({ whatsapp }: Props) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-2 gap-px border-t border-forest-700/10 bg-cream lg:hidden">
      <a
        href={whatsappLink(whatsapp, "Hi CFC! I'd like to know more about your programs.")}
        className="py-4 text-center text-sm font-medium text-forest-900"
      >
        WhatsApp
      </a>
      <a href="/camp-registration" className="bg-leaf-500 py-4 text-center text-sm font-medium text-cream hover:bg-leaf-600 transition-colors">
        Register
      </a>
    </div>
  );
}
