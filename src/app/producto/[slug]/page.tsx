import { cache } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { SITE_URL } from "@/lib/site";
import { Header } from "@/components/Header";
import { AnnouncementBar } from "@/components/AnnouncementBar";
import { Footer } from "@/components/Footer";
import { CartDrawer } from "@/components/CartDrawer";
import { FloatingActions } from "@/components/FloatingActions";
import { ProductGallery } from "@/components/ProductGallery";
import { AddToCartPanel } from "@/components/AddToCartPanel";
import { ProductJsonLd } from "@/components/JsonLd";

const currencyFormatter = new Intl.NumberFormat("es-AR", {
  style: "currency",
  currency: "ARS",
  maximumFractionDigits: 0,
});

export const dynamic = "force-dynamic";

type ProductPageParams = { slug: string };

// `cache()` dedupe la consulta dentro de un mismo request: generateMetadata
// y el componente de la página piden el mismo producto, así se pide una sola
// vez a la base en vez de dos.
const getProductBySlug = cache(async (slug: string) => {
  return prisma.product.findFirst({
    where: { slug, active: true },
    include: {
      collection: true,
      shape: true,
      designLevel: true,
      sizes: { orderBy: { name: "asc" } },
      images: { orderBy: { position: "asc" } },
    },
  });
});

export async function generateMetadata({
  params,
}: {
  params: Promise<ProductPageParams>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return { title: "Producto no encontrado" };
  }

  const description = truncateAtWord(product.description, 155);
  const url = `${SITE_URL}/producto/${product.slug}`;

  return {
    title: product.name,
    description,
    alternates: { canonical: url },
    openGraph: {
      title: product.name,
      description,
      url,
      images: [product.coverImage],
    },
    twitter: {
      card: "summary_large_image",
      title: product.name,
      description,
      images: [product.coverImage],
    },
  };
}

function truncateAtWord(text: string, maxLength: number): string {
  const singleLine = text.replace(/\s+/g, " ").trim();
  if (singleLine.length <= maxLength) return singleLine;
  const cut = singleLine.slice(0, maxLength);
  return `${cut.slice(0, cut.lastIndexOf(" "))}…`;
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<ProductPageParams>;
}) {
  const { slug } = await params;

  const product = await getProductBySlug(slug);

  if (!product) notFound();

  const gallery = [product.coverImage, ...product.images.map((i) => i.url)];
  const finalPrice = product.price + product.designLevel.priceModifier;

  return (
    <div className="flex min-h-full flex-col bg-white">
      <ProductJsonLd
        name={product.name}
        description={product.description}
        image={product.coverImage}
        price={finalPrice}
        url={`${SITE_URL}/producto/${product.slug}`}
      />
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
            <ProductGallery productId={product.id} productName={product.name} images={gallery} />

            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-pink-500">
                {product.collection.name} · {product.shape.name} · {product.designLevel.name}
              </p>
              <h1 className="mb-3 text-2xl font-bold text-zinc-900">{product.name}</h1>
              <p className="mb-6 text-xl font-bold text-zinc-900">
                {currencyFormatter.format(finalPrice)}
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
                  price: finalPrice,
                }}
                sizes={product.sizes.map((s) => s.name)}
              />
            </div>
          </div>
        </div>
      </main>
      <Footer />
      <CartDrawer />
      <FloatingActions />
    </div>
  );
}
