import { getSiteSettings, getNavigation } from "@/lib/data";
import SmoothScroll from "@/components/providers/SmoothScroll";
import MotionProvider from "@/components/providers/MotionProvider";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import StickyMobileActionBar from "@/components/layout/StickyMobileActionBar";

/**
 * Public site shell: smooth scroll + global motion config, fixed header
 * (with announcement bar), footer, and the mobile action bar. The header is
 * fixed/transparent over the hero, so pages own their own top spacing.
 */
export default async function SiteLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const [settings, navigation] = await Promise.all([getSiteSettings(), getNavigation()]);

  return (
    <MotionProvider>
      <SmoothScroll>
        <Header settings={settings} navigation={navigation} />
        <main id="main" className="min-h-svh pt-12">
          {children}
        </main>
        <Footer settings={settings} navigation={navigation} />
        <StickyMobileActionBar whatsapp={settings.whatsapp} />
      </SmoothScroll>
    </MotionProvider>
  );
}
