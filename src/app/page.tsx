import { AnnouncementBar } from "@/components/AnnouncementBar";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Showcase } from "@/components/Showcase";
import { InfoStrip } from "@/components/InfoStrip";
import { Catalog } from "@/components/Catalog";
import { HowToOrder } from "@/components/HowToOrder";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";
import { CartDrawer } from "@/components/CartDrawer";
import { FloatingActions } from "@/components/FloatingActions";
import { CookieBanner } from "@/components/CookieBanner";
import { prisma } from "@/lib/prisma";
import type { CatalogProduct } from "@/types/catalog";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [products, collections, shapes, showcasePhotos, designPhotos] = await Promise.all([
    prisma.product.findMany({
      where: { active: true },
      include: { collection: true, shape: true, designLevel: true, sizes: true, images: true },
      orderBy: { createdAt: "desc" },
    }),
    prisma.collection.findMany({ orderBy: { name: "asc" } }),
    prisma.shape.findMany({ orderBy: { name: "asc" } }),
    prisma.showcasePhoto.findMany({ orderBy: { position: "asc" } }),
    prisma.designPhoto.findMany({ orderBy: { position: "asc" }, take: 3 }),
  ]);

  const catalogProducts: CatalogProduct[] = products.map((product) => ({
    id: product.id,
    slug: product.slug,
    name: product.name,
    description: product.description,
    price: product.price + product.designLevel.priceModifier,
    coverImage: product.coverImage,
    images: product.images.map((i) => i.url),
    collection: product.collection.name,
    shape: product.shape.name,
    designLevel: product.designLevel.name,
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
        <Hero previewPhotos={designPhotos.map((p) => p.url)} />
        <Showcase photos={showcasePhotos.map((p) => p.url)} />
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
      <FloatingActions />
      <CookieBanner />
    </div>
  );
}
