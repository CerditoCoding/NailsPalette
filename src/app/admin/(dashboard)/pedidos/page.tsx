import { prisma } from "@/lib/prisma";
import { AdminOrdersView } from "@/components/admin/AdminOrdersView";

export const dynamic = "force-dynamic";

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({
    include: { items: true },
    orderBy: { orderNumber: "desc" },
  });

  return (
    <div>
      <h1 className="mb-2 text-xl font-bold text-zinc-900">Pedidos</h1>
      <p className="mb-6 text-sm text-zinc-500">
        {orders.length} pedido(s) recibidos. Usá &ldquo;Comunicarse con el cliente&rdquo; para
        coordinar por WhatsApp.
      </p>

      <AdminOrdersView
        initialOrders={orders.map((order) => ({
          ...order,
          createdAt: order.createdAt.toISOString(),
        }))}
      />
    </div>
  );
}
