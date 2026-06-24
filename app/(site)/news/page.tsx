import type { Metadata } from "next";
import { getPosts, getGuides, getEvents } from "@/lib/data";
import PageHero from "@/components/shared/PageHero";
import Section from "@/components/ui/Section";
import Button from "@/components/ui/Button";
import Link from "next/link";

export const metadata: Metadata = {
  title: "News & Publications | Conscious Family Centre",
  description: "Stories, articles, announcements, and updates from Conscious Family Centre",
};

const NEWS_CATEGORIES = [
  {
    id: "announcements",
    title: "Announcements",
    description: "Important updates and news from CFC",
  },
  {
    id: "articles",
    title: "Articles",
    description: "Insights on nature-connected learning and child development",
  },
  {
    id: "events",
    title: "Events",
    description: "Workshops, gatherings, and community events",
  },
  {
    id: "resources",
    title: "Parent Resources",
    description: "Guides and tips for families",
  },
  {
    id: "stories",
    title: "Community Stories",
    description: "Stories from our families and children",
  },
  {
    id: "camp",
    title: "Camp Updates",
    description: "Summer camp news and updates",
  },
];

export default async function NewsPage() {
  const [posts, guides, events] = await Promise.all([
    getPosts(),
    getGuides(),
    getEvents(),
  ]);

  return (
    <>
      <PageHero
        title="News & Publications"
        intro="Stories, updates, and insights from our community"
      />

      {/* Categories Grid */}
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

      {/* Recent Posts */}
      {posts.length > 0 && (
        <Section tone="sage" spacing="lg">
          <div className="mb-12">
            <h2 className="font-display text-3xl md:text-4xl font-semibold text-forest-900 mb-2">
              Latest Articles
            </h2>
            <p className="text-bark-700/70">
              Recent posts and announcements from our community
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {posts.slice(0, 6).map((post) => (
              <Link
                key={post.slug}
                href={`/news/${post.slug}`}
                className="group flex flex-col rounded-2xl border border-forest-700/10 bg-white p-6 hover:shadow-lg transition-shadow"
              >
                {post.cover && (
                  <div className="relative aspect-video rounded-lg mb-4 overflow-hidden bg-forest-700/10">
                    <img
                      src={post.cover.src}
                      alt={post.cover.alt}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                )}
                <h3 className="font-display text-lg font-semibold text-forest-900 mb-2 group-hover:text-leaf-600 transition-colors line-clamp-2">
                  {post.title}
                </h3>
                {post.excerpt && (
                  <p className="text-sm text-bark-700/70 mb-4 line-clamp-2">
                    {post.excerpt}
                  </p>
                )}
                <div className="mt-auto text-sm text-leaf-600 font-semibold">
                  Read more →
                </div>
              </Link>
            ))}
          </div>

          {posts.length > 6 && (
            <div className="mt-12 text-center">
              <Button href="/news/articles" variant="ghost">
                View all articles
              </Button>
            </div>
          )}
        </Section>
      )}

      {/* Recent Events */}
      {events.length > 0 && (
        <Section tone="white" spacing="lg">
          <div className="mb-12">
            <h2 className="font-display text-3xl md:text-4xl font-semibold text-forest-900 mb-2">
              Upcoming Events
            </h2>
            <p className="text-bark-700/70">
              Workshops, gatherings, and community events
            </p>
          </div>

          <div className="space-y-4">
            {events.slice(0, 5).map((event, i) => (
              <div
                key={`${event.title}-${i}`}
                className="rounded-xl border border-forest-700/10 bg-sage-100 p-6 hover:shadow-md transition-shadow"
              >
                <h3 className="font-display text-lg font-semibold text-forest-900 mb-2">
                  {event.title}
                </h3>
                {event.description && (
                  <p className="text-sm text-bark-700/70 mb-4">
                    {event.description}
                  </p>
                )}
                {event.startDate && (
                  <p className="text-sm font-medium text-leaf-600">
                    {new Date(event.startDate).toLocaleDateString('en-US', {
                      weekday: 'short',
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </p>
                )}
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* Parent Resources */}
      {guides.length > 0 && (
        <Section tone="cream" spacing="lg">
          <div className="mb-12">
            <h2 className="font-display text-3xl md:text-4xl font-semibold text-forest-900 mb-2">
              Parent Resources
            </h2>
            <p className="text-bark-700/70">
              Guides, tips, and resources for families
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {guides.slice(0, 4).map((guide) => (
              <div
                key={guide.slug}
                className="rounded-xl border border-forest-700/10 bg-white p-6 hover:shadow-md transition-shadow"
              >
                <h3 className="font-display text-lg font-semibold text-forest-900 mb-2">
                  {guide.title}
                </h3>
                {guide.summary && (
                  <p className="text-sm text-bark-700/70 mb-4">
                    {guide.summary}
                  </p>
                )}
                {guide.topic && (
                  <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-leaf-600/10 text-leaf-700">
                    {guide.topic}
                  </span>
                )}
              </div>
            ))}
          </div>
        </Section>
      )}
    </>
  );
}
