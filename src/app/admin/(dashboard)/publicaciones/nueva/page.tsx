import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { ProductForm } from "@/components/admin/ProductForm";

export const dynamic = "force-dynamic";

export default async function NewProductPage() {
  const [collections, shapes, sizes] = await Promise.all([
    prisma.collection.findMany({ orderBy: { name: "asc" } }),
    prisma.shape.findMany({ orderBy: { name: "asc" } }),
    prisma.size.findMany({ orderBy: { name: "asc" } }),
  ]);

  return (
    <div>
      <Link href="/admin/publicaciones" className="mb-4 inline-block text-sm text-pink-500 hover:underline">
        ← Volver a publicaciones
      </Link>
      <h1 className="mb-6 text-xl font-bold text-zinc-900">Nueva publicación</h1>
      {(collections.length === 0 || shapes.length === 0 || sizes.length === 0) && (
        <p className="mb-4 rounded-lg bg-amber-50 px-4 py-3 text-sm text-amber-700">
          Necesitás al menos una colección, una forma y un talle creados en{" "}
          <Link href="/admin/etiquetas" className="underline">
            Etiquetas
          </Link>{" "}
          antes de crear una publicación.
        </p>
      )}
      <ProductForm tags={{ collections, shapes, sizes }} />
    </div>
  );
}
