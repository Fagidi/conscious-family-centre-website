import "server-only";
import { fetchWithFallback } from "@/lib/sanity/client";
import type { EmailBranding } from "./types";

const DEFAULT: EmailBranding = {
  senderName:       process.env.BREVO_SENDER_NAME  ?? "Conscious Family Centre",
  senderEmail:      process.env.BREVO_SENDER_EMAIL ?? "hello@consciousfamilycentre.com",
  replyTo:          process.env.BREVO_REPLY_TO     ?? "hello@consciousfamilycentre.com",
  schoolAddress:    "Wuse 2, Abuja, Nigeria",
  phone:            "",
  website:          process.env.NEXT_PUBLIC_SITE_URL ?? "https://consciousfamilycentre.com",
  footerCopyright:  `© ${new Date().getFullYear()} Conscious Family Centre. All rights reserved.`,
  footerDisclaimer: "",
  accentColor:      "#2F5D45",
};

const QUERY = `*[_type == "emailBranding"][0]{
  senderName, senderEmail, replyTo, schoolAddress, phone,
  website, facebook, instagram, footerCopyright, footerDisclaimer, accentColor
}`;

export async function getEmailBranding(): Promise<EmailBranding> {
  return fetchWithFallback<EmailBranding>(QUERY, DEFAULT);
}
