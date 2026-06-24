import type { Metadata } from "next";
import PageHero from "@/components/shared/PageHero";
import Section from "@/components/ui/Section";
import Button from "@/components/ui/Button";
import FounderModal from "@/components/about/FounderModal";

// Default founder data (will be replaced with CMS data)
const DEFAULT_FOUNDER = {
  name: "Founder Name",
  role: "Founder & Executive Director",
  shortBio: "Passionate about nature-connected learning and family wellness.",
  fullBio: "Coming soon — the complete story of the founder's journey, vision, and mission to create Conscious Family Centre. This section will be populated from Sanity CMS.",
  philosophy: "Our approach is rooted in the belief that children learn best when connected to nature, supported by intentional community, and guided by caring adults who understand child development.",
  vision: "We envision a world where every child has access to nature-connected learning experiences that foster emotional resilience, creativity, and a deep love for the natural world.",
  photo: null,
};

export const metadata: Metadata = {
  title: "Founder | Conscious Family Centre",
  description: "Learn about the founder and vision behind Conscious Family Centre",
};

export default function FounderPage() {
  const founder = DEFAULT_FOUNDER;

  return (
    <>
      <PageHero
        title="The Founder"
        intro="The vision, philosophy, and journey behind Conscious Family Centre"
      />

      {/* Founder Profile Card */}
      <Section tone="white" spacing="lg">
        <div className="max-w-2xl mx-auto mb-20">
          <div className="rounded-2xl border border-forest-700/10 bg-cream p-8 md:p-12">
            {/* Founder Info */}
            <div className="text-center mb-8">
              {founder.photo && (
                <div className="mb-6 flex justify-center">
                  <div className="relative w-32 h-32 rounded-full overflow-hidden bg-forest-700/10">
                    <img
                      src={founder.photo}
                      alt={founder.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              )}

              <h2 className="font-display text-4xl font-semibold text-forest-900 mb-2">
                {founder.name}
              </h2>

              <p className="text-lg text-leaf-600 font-semibold mb-6">
                {founder.role}
              </p>

              <p className="text-lg leading-relaxed text-bark-700/85 mb-8">
                {founder.shortBio}
              </p>

              <FounderModal founderName={founder.name} founderBio={founder.fullBio} />
            </div>
          </div>
        </div>
      </Section>

      {/* Philosophy & Vision */}
      <Section tone="sage" spacing="lg">
        <div className="grid gap-12 md:grid-cols-2 max-w-4xl mx-auto">
          {/* Philosophy */}
          <div>
            <h3 className="font-display text-2xl font-semibold text-forest-900 mb-6">
              Founding Philosophy
            </h3>
            <p className="text-lg leading-relaxed text-bark-700/85">
              {founder.philosophy}
            </p>
          </div>

          {/* Vision */}
          <div>
            <h3 className="font-display text-2xl font-semibold text-forest-900 mb-6">
              Vision for the Future
            </h3>
            <p className="text-lg leading-relaxed text-bark-700/85">
              {founder.vision}
            </p>
          </div>
        </div>
      </Section>

      {/* CTA */}
      <Section tone="white" spacing="lg">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-lg text-bark-700/70 mb-8">
            Interested in our approach to nature-connected learning?
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button href="/about" variant="primary">
              Explore Our Story
            </Button>
            <Button href="/about/team" variant="secondary">
              Meet The Team
            </Button>
            <Button href="/contact" variant="ghost">
              Get in Touch
            </Button>
          </div>
        </div>
      </Section>
    </>
  );
}
