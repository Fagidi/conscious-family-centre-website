import Link from "next/link";
import type { SiteSettings, Navigation } from "@/lib/types";
import { whatsappLink } from "@/lib/utils";
import Button from "@/components/ui/Button";
import NewsletterForm from "@/components/forms/NewsletterForm";

interface FooterProps {
  settings: SiteSettings;
  navigation: Navigation;
}

/** Premium footer — camp CTA band, nav, contact/NAP, socials, newsletter. */
export default function Footer({ settings, navigation }: FooterProps) {
  const socials = Object.entries(settings.socials ?? {}).filter(([, url]) => Boolean(url));

  return (
    <footer className="bg-forest-900 text-cream">
      {/* Camp CTA band */}
      <div className="border-b border-cream/10">
        <div className="mx-auto flex max-w-content flex-col items-center gap-5 px-gutter py-12 text-center md:flex-row md:justify-between md:text-left">
          <div>
            <p className="font-display text-display-sm text-cream">Ready to join us this summer?</p>
            <p className="mt-1 text-cream/70">Secure a place at our holiday camp — spaces are limited.</p>
          </div>
          <Button href="/camp-registration" variant="secondary">
            Register for Camp
          </Button>
        </div>
      </div>

      {/* Main footer */}
      <div className="mx-auto grid max-w-content gap-10 px-gutter py-16 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <p className="font-display text-2xl">{settings.siteName}</p>
          <p className="mt-3 max-w-xs text-sm text-cream/70">{settings.tagline}</p>
          {socials.length > 0 && (
            <div className="mt-5 flex gap-4 text-sm text-cream/80">
              {socials.map(([name, url]) => (
                <a key={name} href={url as string} target="_blank" rel="noopener noreferrer" className="capitalize hover:text-cream">
                  {name}
                </a>
              ))}
            </div>
          )}
        </div>

        {(navigation.footer ?? []).map((col) => (
          <div key={col.heading}>
            <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-sun-400">{col.heading}</p>
            <ul className="space-y-2 text-sm text-cream/80">
              {(col.links ?? []).map((link) => (
                <li key={`${col.heading}-${link.label}`}>
                  <Link href={link.href} className="hover:text-cream">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}

        <div className="text-sm text-cream/80">
          <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-sun-400">Visit & contact</p>
          <p>{settings.address.line}</p>
          <p>
            {settings.address.area}, {settings.address.city}
          </p>
          <p className="mt-3">
            <a href={`tel:${settings.phone.replace(/\s/g, "")}`} className="hover:text-cream">
              {settings.phone}
            </a>
          </p>
          <p>
            <a href={whatsappLink(settings.whatsapp)} target="_blank" rel="noopener noreferrer" className="hover:text-cream">
              WhatsApp
            </a>
          </p>
          {(settings.hours ?? []).map((h) => (
            <p key={h} className="text-cream/60">
              {h}
            </p>
          ))}
          <div className="mt-5">
            <p className="text-sm font-semibold uppercase tracking-wide text-sun-400">Newsletter</p>
            <NewsletterForm />
          </div>
        </div>
      </div>

      <div className="border-t border-cream/10 px-gutter py-5">
        <div className="mx-auto flex max-w-content flex-col items-center justify-between gap-2 text-xs text-cream/60 sm:flex-row">
          <p>
            © {new Date().getFullYear()} {settings.siteName}. All rights reserved.
          </p>
          <div className="flex gap-4">
            <Link href="/privacy-policy" className="hover:text-cream">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-cream">
              Terms &amp; Conditions
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
