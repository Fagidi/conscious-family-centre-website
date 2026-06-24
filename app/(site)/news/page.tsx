import type { Metadata } from "next";
import PageHero from "@/components/shared/PageHero";
import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";

export const metadata: Metadata = {
  title: "News & Publications | Conscious Family Centre",
  description: "Stories, articles, announcements, and updates from Conscious Family Centre",
};

const NEWS_CATEGORIES = [
  {
    id: "announcements",
    title: "Announcements",
    description: "Important updates and news from CFC",
    color: "leaf",
  },
  {
    id: "articles",
    title: "Articles",
    description: "Insights on nature-connected learning and child development",
    color: "sage",
  },
  {
    id: "events",
    title: "Events",
    description: "Workshops, gatherings, and community events",
    color: "sun",
  },
  {
    id: "resources",
    title: "Parent Resources",
    description: "Guides and tips for families",
    color: "bark",
  },
  {
    id: "stories",
    title: "Community Stories",
    description: "Stories from our families and children",
    color: "forest",
  },
  {
    id: "camp",
    title: "Camp Updates",
    description: "Summer camp news and updates",
    color: "leaf",
  },
];

export default function NewsPage() {
  return (
    <>
      <PageHero
        title="News & Publications"
        intro="Stories, updates, and insights from our community"
      />

      <Section tone="white" spacing="lg">
        <div className="text-center mb-16">
          <p className="text-lg text-bark-700/70 max-w-2xl mx-auto">
            Stay connected with our community. Browse announcements, articles, events, and stories from Conscious Family Centre.
          </p>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {NEWS_CATEGORIES.map((category) => (
            <div
              key={category.id}
              className="group rounded-2xl border border-forest-700/10 bg-cream p-8 hover:shadow-lg transition-shadow duration-300"
            >
              <h3 className="font-display text-xl font-semibold text-forest-900 mb-2">
                {category.title}
              </h3>
              <p className="text-bark-700/70 mb-6">
                {category.description}
              </p>
              <a
                href={`#${category.id}`}
                className="inline-flex text-leaf-600 font-semibold text-sm hover:text-leaf-700 transition-colors"
              >
                Explore →
              </a>
            </div>
          ))}
        </div>
      </Section>

      <section className="py-24 md:py-32 bg-sage-100">
        <div className="mx-auto max-w-site px-gutter">
          <div className="text-center">
            <h2 className="font-display text-3xl md:text-4xl font-semibold text-forest-900 mb-4">
              Coming Soon
            </h2>
            <p className="text-lg text-bark-700/70">
              We're building out our news platform. Check back soon for articles, announcements, and community updates.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
