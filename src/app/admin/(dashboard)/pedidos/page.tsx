import { prisma } from "@/lib/prisma";
import { OrderCard } from "@/components/admin/OrderCard";

export const dynamic = "force-dynamic";

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({
    include: { items: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <h1 className="mb-2 text-xl font-bold text-zinc-900">Pedidos</h1>
      <p className="mb-6 text-sm text-zinc-500">
        {orders.length} pedido(s) recibidos. Usá &ldquo;Comunicarse con el cliente&rdquo; para
        coordinar por WhatsApp.
      </p>

      {orders.length === 0 ? (
        <p className="rounded-2xl border border-pink-100 bg-white px-4 py-8 text-center text-sm text-zinc-400">
          Todavía no hay pedidos.
        </p>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <OrderCard
              key={order.id}
              order={{
                ...order,
                createdAt: order.createdAt.toISOString(),
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
