import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { DeleteProductButton } from "@/components/admin/DeleteProductButton";

export const dynamic = "force-dynamic";

const currencyFormatter = new Intl.NumberFormat("es-AR", {
  style: "currency",
  currency: "ARS",
  maximumFractionDigits: 0,
});

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({
    include: { collection: true, shape: true, designLevel: true, sizes: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-zinc-900">Publicaciones</h1>
          <p className="text-sm text-zinc-500">{products.length} diseño(s) publicados.</p>
        </div>
        <Link
          href="/admin/publicaciones/nueva"
          className="rounded-full bg-pink-400 px-5 py-2 text-sm font-semibold uppercase tracking-wide text-white hover:bg-pink-500"
        >
          + Nueva publicación
        </Link>
      </div>

      <div className="overflow-hidden rounded-2xl border border-pink-100 bg-white">
        <table className="w-full text-sm">
          <thead className="bg-pink-50/60 text-left text-xs uppercase tracking-wide text-zinc-500">
            <tr>
              <th className="px-4 py-3">Diseño</th>
              <th className="px-4 py-3">Colección / Forma</th>
              <th className="px-4 py-3">Nivel de diseño</th>
              <th className="px-4 py-3">Talles</th>
              <th className="px-4 py-3">Precio</th>
              <th className="px-4 py-3 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="border-t border-pink-50">
                <td className="flex items-center gap-3 px-4 py-3">
                  {product.coverImage.startsWith("emoji:") ? (
                    <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-pink-100 text-lg">
                      {product.coverImage.replace("emoji:", "")}
                    </span>
                  ) : (
                    <Image
                      src={product.coverImage}
                      alt={product.name}
                      width={40}
                      height={40}
                      className="h-10 w-10 rounded-lg object-cover"
                    />
                  )}
                  <span className="font-medium text-zinc-900">{product.name}</span>
                </td>
                <td className="px-4 py-3 text-zinc-600">
                  {product.collection.name} · {product.shape.name}
                </td>
                <td className="px-4 py-3 text-zinc-600">{product.designLevel.name}</td>
                <td className="px-4 py-3 text-zinc-600">
                  {product.sizes.map((s) => s.name).join(", ")}
                </td>
                <td className="px-4 py-3 text-zinc-900">
                  {currencyFormatter.format(product.price)}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-3">
                    <Link
                      href={`/admin/publicaciones/${product.id}/editar`}
                      className="text-xs font-medium text-pink-500 hover:underline"
                    >
                      Editar
                    </Link>
                    <DeleteProductButton id={product.id} name={product.name} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {products.length === 0 && (
          <p className="px-4 py-8 text-center text-sm text-zinc-400">
            Todavía no creaste ninguna publicación.
          </p>
        )}
      </div>
    </div>
  );
}
