import type { Metadata } from "next";
import { Fraunces, Inter } from "next/font/google";
import { getDefaultSeo } from "@/lib/data";
import "./globals.css";

const display = Fraunces({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-display",
  display: "swap",
});

const sans = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-sans",
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://consciousfamilycentre.com";

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getDefaultSeo();
  return {
    metadataBase: new URL(siteUrl),
    title: { default: seo.title, template: "%s | Conscious Family Centre" },
    description: seo.description,
    keywords: seo.keywords,
    openGraph: {
      title: seo.title,
      description: seo.description,
      url: siteUrl,
      siteName: "Conscious Family Centre",
      locale: "en_NG",
      type: "website",
      ...(seo.ogImage ? { images: [{ url: seo.ogImage }] } : {}),
    },
    twitter: { card: "summary_large_image", title: seo.title, description: seo.description },
    robots: { index: true, follow: true },
  };
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${display.variable} ${sans.variable}`}>
      <body>{children}</body>
    </html>
  );
}
