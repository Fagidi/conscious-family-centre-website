import type { Metadata } from "next";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import { getSeoSettings } from "@/lib/data";
import "./globals.css";

const display = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-display",
  display: "swap",
});

const sans = Manrope({
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600"],
  variable: "--font-sans",
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://saraiphotobooth.com";

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getSeoSettings();
  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: seo.metaTitle,
      template: "%s | Sarai Photo Booth",
    },
    description: seo.metaDescription,
    keywords: seo.keywords,
    openGraph: {
      title: seo.metaTitle,
      description: seo.metaDescription,
      url: siteUrl,
      siteName: "Sarai Photo Booth",
      locale: "en_US",
      type: "website",
      ...(seo.ogImage ? { images: [{ url: seo.ogImage }] } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: seo.metaTitle,
      description: seo.metaDescription,
    },
    robots: { index: true, follow: true },
  };
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${display.variable} ${sans.variable}`}>
      <body>{children}</body>
    </html>
  );
}
