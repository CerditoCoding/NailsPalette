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
import { prisma } from "@/lib/prisma";
import type { CatalogProduct } from "@/types/catalog";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [products, collections, shapes] = await Promise.all([
    prisma.product.findMany({
      where: { active: true },
      include: { collection: true, shape: true, sizes: true, images: true },
      orderBy: { createdAt: "desc" },
    }),
    prisma.collection.findMany({ orderBy: { name: "asc" } }),
    prisma.shape.findMany({ orderBy: { name: "asc" } }),
  ]);

  const catalogProducts: CatalogProduct[] = products.map((product) => ({
    id: product.id,
    slug: product.slug,
    name: product.name,
    description: product.description,
    price: product.price,
    coverImage: product.coverImage,
    images: product.images.map((i) => i.url),
    collection: product.collection.name,
    shape: product.shape.name,
    sizes: product.sizes.map((s) => s.name),
  }));

  const allSizeNames = Array.from(
    new Set(products.flatMap((p) => p.sizes.map((s) => s.name)))
  ).sort();

  return (
    <div className="flex min-h-full flex-col bg-white">
      <AnnouncementBar />
      <Header />
      <main className="flex-1">
        <Hero />
        <InfoStrip />
        <Catalog
          products={catalogProducts}
          collections={collections.map((c) => c.name)}
          shapes={shapes.map((s) => s.name)}
          sizes={allSizeNames}
        />
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
