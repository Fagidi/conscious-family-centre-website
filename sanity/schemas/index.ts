import { siteSettings } from "./siteSettings";
import { seoSettings } from "./seoSettings";
import { hero } from "./hero";
import { homePage } from "./homePage";
import { aboutPage } from "./aboutPage";
import { servicesPage } from "./servicesPage";
import { faqPage } from "./faqPage";
import { ctaSection } from "./ctaSection";
import { service } from "./service";
import { testimonial } from "./testimonial";
import { galleryImage } from "./galleryImage";
import { faqItem } from "./faqItem";
import { contactInfo } from "./contactInfo";

export const schemaTypes = [
  // Singletons
  siteSettings,
  seoSettings,
  homePage,
  aboutPage,
  servicesPage,
  faqPage,
  contactInfo,
  ctaSection,
  // Collections
  hero,
  service,
  testimonial,
  galleryImage,
  faqItem,
];
