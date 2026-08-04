import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Header } from "@/components/Header";
import { AnnouncementBar } from "@/components/AnnouncementBar";
import { Footer } from "@/components/Footer";
import { CartDrawer } from "@/components/CartDrawer";
import { FloatingWhatsapp } from "@/components/FloatingWhatsapp";
import { ProductGallery } from "@/components/ProductGallery";
import { AddToCartPanel } from "@/components/AddToCartPanel";

const currencyFormatter = new Intl.NumberFormat("es-AR", {
  style: "currency",
  currency: "ARS",
  maximumFractionDigits: 0,
});

export const dynamic = "force-dynamic";

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const product = await prisma.product.findFirst({
    where: { slug, active: true },
    include: {
      collection: true,
      shape: true,
      sizes: { orderBy: { name: "asc" } },
      images: { orderBy: { position: "asc" } },
    },
  });

  if (!product) notFound();

  const gallery = [product.coverImage, ...product.images.map((i) => i.url)];

  return (
    <div className="flex min-h-full flex-col bg-white">
      <AnnouncementBar />
      <Header />
      <main className="flex-1">
        <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
          <Link
            href="/#catalogo"
            className="mb-6 inline-flex items-center gap-1 text-sm font-medium text-zinc-600 hover:text-pink-500"
          >
            ← Volver al catálogo
          </Link>

          <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
            <ProductGallery productId={product.id} images={gallery} />

            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-pink-500">
                {product.collection.name} · {product.shape.name}
              </p>
              <h1 className="mb-3 text-2xl font-bold text-zinc-900">{product.name}</h1>
              <p className="mb-6 text-xl font-bold text-zinc-900">
                {currencyFormatter.format(product.price)}
              </p>
              <p className="mb-8 whitespace-pre-line text-sm leading-relaxed text-zinc-600">
                {product.description}
              </p>

              <AddToCartPanel
                product={{
                  id: product.id,
                  slug: product.slug,
                  name: product.name,
                  coverImage: product.coverImage,
                  price: product.price,
                }}
                sizes={product.sizes.map((s) => s.name)}
              />
            </div>
          </div>
        </div>
      </main>
      <Footer />
      <CartDrawer />
      <FloatingWhatsapp />
    </div>
  );
}
