/**
 * Mega-menu presentation config (UI only — not CMS-managed). Fullscreen editorial
 * menu with left column (primary items) and right column (contextual submenu).
 */

export interface MegaItem {
  title: string;
  description: string;
  href: string;
  image: { src: string; alt: string };
}

export interface MenuSection {
  id: string;
  title: string;
  items: MegaItem[];
}

const img = (seed: string, alt: string) => ({ src: `https://picsum.photos/seed/${seed}/900/640`, alt });

/**
 * Left column: primary navigation items.
 * Each is a top-level destination with description + image.
 */
export const primaryMenuItems: MegaItem[] = [
  { title: "About CFC", description: "Our story, philosophy, and mission.", href: "/about", image: img("cfc-menu-about", "About Conscious Family Centre") },
  { title: "Programs", description: "Play-based, nature-connected learning.", href: "/programs", image: img("cfc-menu-programs", "Our programs") },
  { title: "Community", description: "Events, resources, and family support.", href: "/about#community", image: img("cfc-menu-community", "Our community") },
  { title: "Summer Camp", description: "Future Makers — our 2026 experience.", href: "/camp-registration", image: img("cfc-menu-camp", "Summer camp") },
  { title: "News & Publications", description: "Stories, articles, and updates.", href: "/news", image: img("cfc-menu-news", "News") },
];

/**
 * Right column: contextual submenus. Displayed when corresponding primary item
 * is active/hovered.
 */
export const submenusBySection: Record<string, MegaItem[]> = {
  "About CFC": [
    { title: "Our Story", description: "", href: "/about#our-story", image: img("", "") },
    { title: "Founder", description: "", href: "/about/founder", image: img("", "") },
    { title: "Meet The Team", description: "", href: "/about/team", image: img("", "") },
    { title: "Our Environment", description: "", href: "/about#environment", image: img("", "") },
    { title: "Community", description: "", href: "/about#community", image: img("", "") },
    { title: "News & Publications", description: "", href: "/news", image: img("", "") },
  ],
  "Programs": [
    { title: "Stay & Play", description: "", href: "/programs/stay-and-play", image: img("", "") },
    { title: "Homeschool Hub", description: "", href: "/programs/homeschool-hub", image: img("", "") },
    { title: "Parent Community", description: "", href: "/about#community", image: img("", "") },
    { title: "Nanny Training", description: "", href: "/programs", image: img("", "") },
    { title: "Future Makers Camp", description: "", href: "/camp-registration", image: img("", "") },
  ],
  "Community": [
    { title: "Events", description: "", href: "/about#community", image: img("", "") },
    { title: "Parent Resources", description: "", href: "/news", image: img("", "") },
    { title: "Workshops", description: "", href: "/about#community", image: img("", "") },
    { title: "Community Stories", description: "", href: "/news", image: img("", "") },
  ],
  "Summer Camp": [
    { title: "Future Makers Camp", description: "", href: "/camp-registration", image: img("", "") },
    { title: "Camp Information", description: "", href: "/camp-registration", image: img("", "") },
    { title: "Registration", description: "", href: "/camp-registration", image: img("", "") },
    { title: "Camp FAQs", description: "", href: "/faq", image: img("", "") },
  ],
  "News & Publications": [
    { title: "Announcements", description: "", href: "/news", image: img("", "") },
    { title: "Articles", description: "", href: "/news", image: img("", "") },
    { title: "Events", description: "", href: "/news", image: img("", "") },
    { title: "Parent Resources", description: "", href: "/news", image: img("", "") },
    { title: "Community Updates", description: "", href: "/news", image: img("", "") },
  ],
};
