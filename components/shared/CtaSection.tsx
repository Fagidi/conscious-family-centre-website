import Button from "@/components/ui/Button";
import Container from "@/components/ui/Container";
import type { Cta } from "@/lib/types";

interface CtaSectionProps {
  heading: string;
  body?: string;
  cta: Cta;
}

/** Reusable closing CTA band. Scaffold — final art in the page-build phase. */
export default function CtaSection({ heading, body, cta }: CtaSectionProps) {
  return (
    <section className="bg-forest-900 py-20 text-cream">
      <Container className="text-center">
        <h2 className="text-display-md text-cream">{heading}</h2>
        {body && <p className="mx-auto mt-4 max-w-prose text-cream/80">{body}</p>}
        <div className="mt-8">
          <Button href={cta.href} variant={cta.variant === "secondary" ? "secondary" : "primary"}>
            {cta.label}
          </Button>
        </div>
      </Container>
    </section>
  );
}
