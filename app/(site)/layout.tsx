import { getSiteSettings } from "@/lib/data";
import SmoothScroll from "@/components/providers/SmoothScroll";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export default async function SiteLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const settings = await getSiteSettings();

  return (
    <SmoothScroll>
      <Header settings={settings} />
      <main>{children}</main>
      <Footer settings={settings} />
    </SmoothScroll>
  );
}
