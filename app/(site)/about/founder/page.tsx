import type { Metadata } from "next";
import PageHero from "@/components/shared/PageHero";
import Section from "@/components/ui/Section";
import Link from "next/link";
import Button from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Founder | Conscious Family Centre",
  description: "Learn about the founder and vision behind Conscious Family Centre",
};

export default function FounderPage() {
  return (
    <>
      <PageHero
        title="The Founder"
        intro="The vision, philosophy, and journey behind Conscious Family Centre"
      />

      <Section tone="white" spacing="lg">
        <div className="max-w-3xl mx-auto">
          {/* Story Section */}
          <div className="mb-20">
            <h2 className="font-display text-3xl md:text-4xl font-semibold text-forest-900 mb-6">
              A Journey to Nature-Connected Learning
            </h2>
            <div className="space-y-5 text-lg leading-relaxed text-bark-700/85">
              <p>
                Coming soon — the founder's personal story, the inspiration behind creating Conscious Family Centre, and the journey to building a space where children and families grow together.
              </p>
            </div>
          </div>

          {/* Philosophy Section */}
          <div className="mb-20 pt-12 border-t border-forest-700/10">
            <h3 className="font-display text-2xl font-semibold text-forest-900 mb-6">
              Our Founding Philosophy
            </h3>
            <p className="text-lg leading-relaxed text-bark-700/85">
              Coming soon — the core principles and beliefs that guide our approach to education and family support.
            </p>
          </div>

          {/* Vision Section */}
          <div className="mb-20 pt-12 border-t border-forest-700/10">
            <h3 className="font-display text-2xl font-semibold text-forest-900 mb-6">
              Vision for the Future
            </h3>
            <p className="text-lg leading-relaxed text-bark-700/85">
              Coming soon — where we're heading and how we're growing to serve more families in Abuja and beyond.
            </p>
          </div>

          {/* CTA Section */}
          <div className="mt-16 pt-12 border-t border-forest-700/10">
            <p className="text-lg text-bark-700/70 mb-8">
              Interested in our approach to nature-connected learning? Learn more about our programs and community.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button href="/about" variant="primary">
                Explore Our Story
              </Button>
              <Button href="/programs" variant="secondary">
                View Programs
              </Button>
              <Button href="/contact" variant="ghost">
                Get in Touch
              </Button>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
