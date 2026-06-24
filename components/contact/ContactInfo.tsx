import type { SiteSettings } from "@/lib/types";
import { whatsappLink } from "@/lib/utils";
import { Stagger, StaggerItem } from "@/components/motion/Stagger";
import ContactCard from "./ContactCard";

/** Contact details grid — phone, WhatsApp, email, address, hours (from CMS settings). */
export default function ContactInfo({ settings }: { settings: SiteSettings }) {
  const { phone, whatsapp, email, address, hours } = settings;
  const telHref = `tel:${phone.replace(/[^\d+]/g, "")}`;

  return (
    <Stagger className="grid gap-4 sm:grid-cols-2">
      <StaggerItem className="h-full">
        <ContactCard icon="sun" label="Call us" lines={[phone]} href={telHref} copyValue={phone} />
      </StaggerItem>
      <StaggerItem className="h-full">
        <ContactCard
          icon="compass"
          label="WhatsApp"
          lines={[whatsapp]}
          href={whatsappLink(whatsapp)}
          copyValue={whatsapp}
        />
      </StaggerItem>
      <StaggerItem className="h-full">
        <ContactCard icon="leaf" label="Email" lines={[email]} href={`mailto:${email}`} copyValue={email} />
      </StaggerItem>
      <StaggerItem className="h-full">
        <ContactCard
          icon="sprout"
          label="Visit us"
          lines={[address.line, `${address.area}, ${address.city}`]}
          href={address.mapUrl}
          copyValue={`${address.line}, ${address.area}, ${address.city}`}
        />
      </StaggerItem>
      <StaggerItem className="h-full sm:col-span-2">
        <ContactCard icon="sun" label="Opening hours" lines={hours} />
      </StaggerItem>
    </Stagger>
  );
}
