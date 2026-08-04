import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdminHomePage() {
  const [productCount, orderCount, newOrderCount, tagCount] = await Promise.all([
    prisma.product.count(),
    prisma.order.count(),
    prisma.order.count({ where: { status: "nuevo" } }),
    prisma.collection.count().then(async (c) => {
      const shapes = await prisma.shape.count();
      const sizes = await prisma.size.count();
      return c + shapes + sizes;
    }),
  ]);

  const cards = [
    { label: "Publicaciones", value: productCount, href: "/admin/publicaciones" },
    { label: "Pedidos nuevos", value: newOrderCount, href: "/admin/pedidos" },
    { label: "Pedidos totales", value: orderCount, href: "/admin/pedidos" },
    { label: "Etiquetas", value: tagCount, href: "/admin/etiquetas" },
  ];

  return (
    <div>
      <h1 className="mb-6 text-xl font-bold text-zinc-900">Resumen</h1>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {cards.map((card) => (
          <Link
            key={card.label}
            href={card.href}
            className="rounded-2xl border border-pink-100 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
          >
            <p className="text-2xl font-bold text-zinc-900">{card.value}</p>
            <p className="text-sm text-zinc-500">{card.label}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
