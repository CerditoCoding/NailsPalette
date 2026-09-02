"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { buildWhatsappLinkTo } from "@/lib/whatsapp";
import { formatCurrency } from "@/lib/currency";
import {
  ORDER_STATUSES,
  STATUS_BADGE_STYLES,
  STATUS_CARD_STYLES,
  STATUS_LABELS,
  formatOrderNumber,
  type OrderStatus,
} from "@/lib/orderStatus";

const dateFormatter = new Intl.DateTimeFormat("es-AR", {
  dateStyle: "short",
  timeStyle: "short",
});

export type OrderItem = {
  id: string;
  productName: string;
  size: string;
  quantity: number;
  unitPrice: number;
};

export type Order = {
  id: string;
  orderNumber: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  city: string;
  province: string;
  postalCode: string;
  notes: string | null;
  shippingEstimate: number | null;
  total: number;
  status: string;
  trackingCode: string | null;
  trackingUrl: string | null;
  createdAt: string;
  items: OrderItem[];
};

export function OrderCard({
  order,
  onDeleted,
}: {
  order: Order;
  onDeleted?: (id: string) => void;
}) {
  const router = useRouter();
  const [status, setStatus] = useState<OrderStatus>(order.status as OrderStatus);
  const [trackingCode, setTrackingCode] = useState(order.trackingCode ?? "");
  const [trackingUrl, setTrackingUrl] = useState(order.trackingUrl ?? "");
  const [updating, setUpdating] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [syncedFrom, setSyncedFrom] = useState({
    status: order.status,
    trackingCode: order.trackingCode,
    trackingUrl: order.trackingUrl,
  });

  // Si el prop trae datos más nuevos que los últimos que sincronizamos
  // (por ej. después de un router.refresh(), o porque el pedido se
  // remontó al filtrarlo y volver a mostrarlo), el estado local tiene que
  // ponerse al día en vez de quedarse pegado al valor que tenía la
  // primera vez que se montó el componente. Se ajusta durante el render
  // (no en un useEffect) para no disparar un re-render en cascada, y solo
  // cuando el valor realmente cambió, para no pisar lo que la admin esté
  // tipeando en los campos de seguimiento sin motivo.
  if (
    order.status !== syncedFrom.status ||
    order.trackingCode !== syncedFrom.trackingCode ||
    order.trackingUrl !== syncedFrom.trackingUrl
  ) {
    setSyncedFrom({
      status: order.status,
      trackingCode: order.trackingCode,
      trackingUrl: order.trackingUrl,
    });
    setStatus(order.status as OrderStatus);
    setTrackingCode(order.trackingCode ?? "");
    setTrackingUrl(order.trackingUrl ?? "");
  }

  const contactMessage = `¡Hola ${order.firstName}! Te escribo de Nails Palette por tu pedido:\n${order.items
    .map((item) => `• ${item.quantity}x ${item.productName} (talle ${item.size})`)
    .join("\n")}\n\nTotal: ${formatCurrency(order.total)}`;

  const persistStatus = async (next: OrderStatus, extra?: { trackingCode?: string; trackingUrl?: string }) => {
    setUpdating(true);
    setError(null);
    const res = await fetch(`/api/admin/orders/${order.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: next, ...extra }),
    });
    if (res.ok) {
      setStatus(next);
      router.refresh();
    } else {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "No se pudo actualizar el pedido.");
    }
    setUpdating(false);
  };

  const handleSaveTracking = () => {
    void persistStatus("ENVIADO", { trackingCode, trackingUrl });
  };

  const handleDelete = async () => {
    setDeleting(true);
    setError(null);
    const res = await fetch(`/api/admin/orders/${order.id}`, { method: "DELETE" });
    if (res.ok) {
      if (onDeleted) onDeleted(order.id);
      else router.refresh();
    } else {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "No se pudo eliminar el pedido.");
      setDeleting(false);
      setConfirming(false);
    }
  };

  return (
    <div className={`relative rounded-2xl bg-white p-5 pb-12 shadow-sm ${STATUS_CARD_STYLES[status]}`}>
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <div>
          <p className="font-semibold text-zinc-900">
            #{formatOrderNumber(order.orderNumber)} · {order.firstName} {order.lastName}
          </p>
          <p className="text-xs text-zinc-500" suppressHydrationWarning>
            {dateFormatter.format(new Date(order.createdAt))}
          </p>
        </div>
        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ${STATUS_BADGE_STYLES[status]}`}
        >
          {STATUS_LABELS[status]}
        </span>
      </div>

      <div className="mb-3 grid grid-cols-1 gap-x-6 gap-y-1 text-sm text-zinc-600 sm:grid-cols-2">
        <p>📧 {order.email}</p>
        <p>📱 {order.phone}</p>
        <p>
          📍 {order.city}, {order.province} (CP {order.postalCode})
        </p>
        <p>
          🚚 Envío:{" "}
          {order.shippingEstimate ? formatCurrency(order.shippingEstimate) : "a coordinar"}
        </p>
        <p>💰 Total: {formatCurrency(order.total)}</p>
      </div>

      <ul className="mb-4 space-y-1 rounded-lg bg-pink-50/60 p-3 text-sm text-zinc-700">
        {order.items.map((item) => (
          <li key={item.id}>
            {item.quantity}x {item.productName} · Talle {item.size} ·{" "}
            {formatCurrency(item.unitPrice)} c/u
          </li>
        ))}
      </ul>

      {order.notes && (
        <p className="mb-4 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
          📝 <span className="font-semibold">Notas:</span> {order.notes}
        </p>
      )}

      <div className="mb-4 flex flex-wrap items-center gap-3">
        <a
          href={buildWhatsappLinkTo(order.phone, contactMessage)}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-full bg-green-500 px-5 py-2 text-xs font-semibold uppercase tracking-wide text-white hover:bg-green-600"
        >
          Comunicarse con el cliente
        </a>

        <label className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-zinc-500">
          Estado
          <select
            value={status}
            disabled={updating}
            onChange={(e) => void persistStatus(e.target.value as OrderStatus)}
            className="rounded-lg border border-zinc-300 px-2 py-1.5 text-xs font-medium normal-case text-zinc-700 focus:border-pink-400 focus:outline-none"
          >
            {ORDER_STATUSES.map((s) => (
              <option key={s} value={s}>
                {STATUS_LABELS[s]}
              </option>
            ))}
          </select>
        </label>

        {updating && <span className="text-xs text-zinc-400">Actualizando...</span>}
      </div>

      {status === "ENVIADO" && (
        <div className="mb-4 rounded-lg border border-indigo-100 bg-indigo-50/50 p-3">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-indigo-700">
            Datos de seguimiento
          </p>
          <div className="flex flex-col gap-2 sm:flex-row">
            <input
              type="text"
              value={trackingCode}
              onChange={(e) => setTrackingCode(e.target.value)}
              placeholder="Código de seguimiento"
              className="min-w-0 flex-1 rounded-lg border border-zinc-300 px-3 py-1.5 text-sm text-zinc-900 focus:border-indigo-400 focus:outline-none"
            />
            <input
              type="text"
              value={trackingUrl}
              onChange={(e) => setTrackingUrl(e.target.value)}
              placeholder="Link de seguimiento (Correo Argentino)"
              className="min-w-0 flex-1 rounded-lg border border-zinc-300 px-3 py-1.5 text-sm text-zinc-900 focus:border-indigo-400 focus:outline-none"
            />
            <button
              type="button"
              onClick={handleSaveTracking}
              disabled={updating}
              className="shrink-0 rounded-lg bg-indigo-500 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-white hover:bg-indigo-600 disabled:opacity-60"
            >
              Guardar seguimiento
            </button>
          </div>
        </div>
      )}

      {error && <p className="mb-2 text-sm text-red-500">{error}</p>}

      {!confirming ? (
        <button
          type="button"
          onClick={() => setConfirming(true)}
          aria-label="Eliminar pedido"
          className="absolute bottom-3 right-3 flex h-7 w-7 items-center justify-center rounded-full text-lg leading-none text-red-500 hover:bg-red-50"
        >
          ×
        </button>
      ) : (
        <div className="absolute bottom-3 right-3 flex items-center gap-2 rounded-lg border border-red-100 bg-white px-3 py-1.5 shadow-sm">
          <span className="text-xs text-zinc-600">¿Seguro querés eliminar el pedido?</span>
          <button
            type="button"
            onClick={handleDelete}
            disabled={deleting}
            className="text-xs font-semibold text-red-600 hover:text-red-700 disabled:opacity-50"
          >
            {deleting ? "..." : "Confirmar"}
          </button>
          <button
            type="button"
            onClick={() => setConfirming(false)}
            disabled={deleting}
            className="text-xs text-zinc-400 hover:text-zinc-600"
          >
            Cancelar
          </button>
        </div>
      )}
    </div>
  );
}
