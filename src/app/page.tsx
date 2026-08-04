import { AnnouncementBar } from "@/components/AnnouncementBar";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { InfoStrip } from "@/components/InfoStrip";
import { Catalog } from "@/components/Catalog";
import { HowToOrder } from "@/components/HowToOrder";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";
import { CartDrawer } from "@/components/CartDrawer";
import { FloatingWhatsapp } from "@/components/FloatingWhatsapp";
import { CookieBanner } from "@/components/CookieBanner";

export default function Home() {
  return (
    <div className="flex min-h-full flex-col bg-white">
      <AnnouncementBar />
      <Header />
      <main className="flex-1">
        <Hero />
        <InfoStrip />
        <Catalog />
        <HowToOrder />
        <Contact />
      </main>
      <Footer />
      <CartDrawer />
      <FloatingWhatsapp />
      <CookieBanner />
    </div>
  );
}
