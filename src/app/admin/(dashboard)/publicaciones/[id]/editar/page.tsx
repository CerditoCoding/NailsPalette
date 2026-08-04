import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ProductForm } from "@/components/admin/ProductForm";

export const dynamic = "force-dynamic";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [product, collections, shapes, sizes] = await Promise.all([
    prisma.product.findUnique({
      where: { id },
      include: { sizes: true, images: { orderBy: { position: "asc" } } },
    }),
    prisma.collection.findMany({ orderBy: { name: "asc" } }),
    prisma.shape.findMany({ orderBy: { name: "asc" } }),
    prisma.size.findMany({ orderBy: { name: "asc" } }),
  ]);

  if (!product) notFound();

  return (
    <div>
      <Link href="/admin/publicaciones" className="mb-4 inline-block text-sm text-pink-500 hover:underline">
        ← Volver a publicaciones
      </Link>
      <h1 className="mb-6 text-xl font-bold text-zinc-900">Editar publicación</h1>
      <ProductForm
        tags={{ collections, shapes, sizes }}
        initialProduct={{
          id: product.id,
          name: product.name,
          description: product.description,
          price: product.price,
          collectionId: product.collectionId,
          shapeId: product.shapeId,
          sizeIds: product.sizes.map((s) => s.id),
          coverImage: product.coverImage,
          images: product.images.map((i) => i.url),
        }}
      />
    </div>
  );
}
