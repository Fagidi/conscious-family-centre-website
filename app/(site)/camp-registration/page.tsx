import type { Metadata } from "next";
import { PROGRAMME } from "@/lib/futureMakers";
import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";
import Container from "@/components/ui/Container";
import Reveal from "@/components/motion/Reveal";
import Includes from "@/components/registration/Includes";
import FeeTable from "@/components/registration/FeeTable";
import RegistrationForm from "@/components/registration/RegistrationForm";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://consciousfamilycentre.com";

export const metadata: Metadata = {
  title: "Future Makers Summer Experience 2026 — Registration",
  description:
    "Register for the Future Makers Summer Experience 2026 at Conscious Family Centre, BMT Garden, Wuse 2, Abuja. July & August 2026, Mon–Fri 10am–3pm. Places limited to 50 children.",
  alternates: { canonical: "/camp-registration" },
  openGraph: {
    title: "Future Makers Summer Experience 2026 — Registration",
    description: "A summer of STEAM, forest school, field trips and creativity for children in Abuja. Register now — places are limited.",
    url: `${siteUrl}/camp-registration`,
    type: "website",
  },
};

const facts = [
  { label: "Location", value: PROGRAMME.location },
  { label: "Dates", value: PROGRAMME.datesLabel },
  { label: "Hours", value: PROGRAMME.hoursLabel },
  { label: "Capacity", value: `Limited to ${PROGRAMME.capacity} children` },
];

export default function CampRegistrationPage() {
  return (
    <>
      {/* Hero — dark band clears the transparent fixed header */}
      <section className="bg-forest-900 text-cream">
        <Container className="pb-16 pt-44 md:pb-20">
          <Reveal>
            <p className="eyebrow mb-4 text-sun-400">{PROGRAMME.centre} · Summer 2026</p>
            <h1 className="max-w-4xl text-display-xl text-cream">{PROGRAMME.name}</h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-cream/85">
              A summer of STEAM projects, forest-school adventures, field trips and creativity. Places are limited and
              allocated on a first-paid, first-served basis.
            </p>
            <p className="mt-4 inline-flex rounded-full bg-sun-400/15 px-4 py-2 text-sm font-medium text-sun-400">
              Early Bird Discount available until {PROGRAMME.earlyBirdUntilLabel}
            </p>
          </Reveal>

          <dl className="mt-12 grid gap-px overflow-hidden rounded-card-lg border border-cream/15 bg-cream/10 sm:grid-cols-2 lg:grid-cols-4">
            {facts.map((f) => (
              <div key={f.label} className="bg-forest-900 p-5">
                <dt className="text-xs font-semibold uppercase tracking-wide text-cream/55">{f.label}</dt>
                <dd className="mt-1 text-cream">{f.value}</dd>
              </div>
            ))}
          </dl>
        </Container>
      </section>

      {/* What's included */}
      <Section tone="cream" spacing="lg">
        <SectionHeading eyebrow="What's included" title="A summer packed with discovery." className="max-w-2xl" />
        <div className="mt-10">
          <Includes />
        </div>
      </Section>

      {/* Fees */}
      <Section tone="sage" spacing="lg">
        <SectionHeading
          eyebrow="Programme fees"
          title="Simple, transparent pricing."
          intro="Fees by age group. 6- and 8-week or custom durations are confirmed by Conscious Family Centre."
          className="max-w-2xl"
        />
        <div className="mt-10">
          <FeeTable />
        </div>
        <p className="mt-6 max-w-3xl text-sm text-bark-700/70">{PROGRAMME.subscriberNote}</p>
      </Section>

      {/* Registration form */}
      <Section tone="cream" spacing="lg" id="register">
        <div className="mx-auto max-w-3xl">
          <SectionHeading
            eyebrow="Register"
            title="Secure your child's place."
            intro="It takes just a few minutes. Your progress is saved on this device as you go."
            align="center"
            className="mx-auto"
          />
          <div className="mt-10">
            <RegistrationForm />
          </div>
        </div>
      </Section>
    </>
  );
}
