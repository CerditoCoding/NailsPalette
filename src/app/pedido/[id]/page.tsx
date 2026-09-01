import { notFound } from "next/navigation";
import { AnnouncementBar } from "@/components/AnnouncementBar";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CartDrawer } from "@/components/CartDrawer";
import { FloatingActions } from "@/components/FloatingActions";
import { prisma } from "@/lib/prisma";
import { formatCurrency } from "@/lib/currency";
import {
  STATUS_BADGE_STYLES,
  STATUS_CARD_STYLES,
  STATUS_LABELS,
  formatOrderNumber,
  isOrderStatus,
} from "@/lib/orderStatus";

const dateFormatter = new Intl.DateTimeFormat("es-AR", {
  dateStyle: "long",
  timeStyle: "short",
});

export const dynamic = "force-dynamic";

export default async function PedidoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const order = await prisma.order.findUnique({
    where: { id },
    include: { items: true },
  });

  if (!order) notFound();

  const status = isOrderStatus(order.status) ? order.status : "NUEVO";

  return (
    <div className="flex min-h-full flex-col bg-white">
      <AnnouncementBar />
      <Header />
      <main className="flex-1">
        <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:px-8">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-pink-500">
            Tu pedido
          </p>
          <h1 className="mb-6 text-2xl font-bold text-zinc-900">
            #{formatOrderNumber(order.orderNumber)}
          </h1>

          <div className={`rounded-2xl bg-white p-5 shadow-sm ${STATUS_CARD_STYLES[status]}`}>
            <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
              <div>
                <p className="font-semibold text-zinc-900">
                  {order.firstName} {order.lastName}
                </p>
                <p className="text-xs text-zinc-500" suppressHydrationWarning>
                  {dateFormatter.format(order.createdAt)}
                </p>
              </div>
              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ${STATUS_BADGE_STYLES[status]}`}
              >
                {STATUS_LABELS[status]}
              </span>
            </div>

            {order.trackingCode && (
              <p className="mb-4 text-sm text-zinc-600">
                Código de seguimiento:{" "}
                {order.trackingUrl ? (
                  <a
                    href={order.trackingUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-blue-600 underline hover:text-blue-700"
                  >
                    {order.trackingCode}
                  </a>
                ) : (
                  <span className="font-medium text-zinc-800">{order.trackingCode}</span>
                )}
              </p>
            )}

            <ul className="mb-4 space-y-1 rounded-lg bg-pink-50/60 p-3 text-sm text-zinc-700">
              {order.items.map((item) => (
                <li key={item.id}>
                  {item.quantity}x {item.productName} · Talle {item.size} ·{" "}
                  {formatCurrency(item.unitPrice)} c/u
                </li>
              ))}
            </ul>

            <div className="space-y-1 text-sm text-zinc-600">
              <p>
                📍 {order.city}, {order.province} (CP {order.postalCode})
              </p>
              <p>
                🚚 Envío:{" "}
                {order.shippingEstimate ? formatCurrency(order.shippingEstimate) : "a coordinar"}
              </p>
              <p className="font-semibold text-zinc-900">💰 Total: {formatCurrency(order.total)}</p>
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
