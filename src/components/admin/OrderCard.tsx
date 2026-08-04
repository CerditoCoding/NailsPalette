"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { buildWhatsappLinkTo } from "@/lib/whatsapp";

const currencyFormatter = new Intl.NumberFormat("es-AR", {
  style: "currency",
  currency: "ARS",
  maximumFractionDigits: 0,
});

const dateFormatter = new Intl.DateTimeFormat("es-AR", {
  dateStyle: "short",
  timeStyle: "short",
});

const STATUS_LABELS: Record<string, string> = {
  nuevo: "Nuevo",
  contactado: "Contactado",
  entregado: "Entregado",
  cancelado: "Cancelado",
};

const STATUS_STYLES: Record<string, string> = {
  nuevo: "bg-pink-100 text-pink-600",
  contactado: "bg-amber-100 text-amber-700",
  entregado: "bg-green-100 text-green-700",
  cancelado: "bg-zinc-200 text-zinc-500",
};

export type OrderItem = {
  id: string;
  productName: string;
  size: string;
  quantity: number;
  unitPrice: number;
};

export type Order = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  city: string;
  province: string;
  postalCode: string;
  total: number;
  status: string;
  createdAt: string;
  items: OrderItem[];
};

export function OrderCard({ order }: { order: Order }) {
  const router = useRouter();
  const [updating, setUpdating] = useState(false);
  const [status, setStatus] = useState(order.status);

  const contactMessage = `¡Hola ${order.firstName}! Te escribo de Nails Palette por tu pedido:\n${order.items
    .map((item) => `• ${item.quantity}x ${item.productName} (talle ${item.size})`)
    .join("\n")}\n\nTotal: ${currencyFormatter.format(order.total)}`;

  const markContacted = async () => {
    if (status !== "nuevo") return;
    setUpdating(true);
    const res = await fetch(`/api/admin/orders/${order.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "contactado" }),
    });
    if (res.ok) {
      setStatus("contactado");
      router.refresh();
    }
    setUpdating(false);
  };

  return (
    <div className="rounded-2xl border border-pink-100 bg-white p-5 shadow-sm">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <div>
          <p className="font-semibold text-zinc-900">
            {order.firstName} {order.lastName}
          </p>
          <p className="text-xs text-zinc-500" suppressHydrationWarning>
            {dateFormatter.format(new Date(order.createdAt))}
          </p>
        </div>
        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ${STATUS_STYLES[status] ?? "bg-zinc-100 text-zinc-600"}`}
        >
          {STATUS_LABELS[status] ?? status}
        </span>
      </div>

      <div className="mb-3 grid grid-cols-1 gap-x-6 gap-y-1 text-sm text-zinc-600 sm:grid-cols-2">
        <p>📧 {order.email}</p>
        <p>📱 {order.phone}</p>
        <p>
          📍 {order.city}, {order.province} (CP {order.postalCode})
        </p>
        <p>💰 Total: {currencyFormatter.format(order.total)}</p>
      </div>

      <ul className="mb-4 space-y-1 rounded-lg bg-pink-50/60 p-3 text-sm text-zinc-700">
        {order.items.map((item) => (
          <li key={item.id}>
            {item.quantity}x {item.productName} · Talle {item.size} ·{" "}
            {currencyFormatter.format(item.unitPrice)} c/u
          </li>
        ))}
      </ul>

      <div className="flex flex-wrap gap-3">
        <a
          href={buildWhatsappLinkTo(order.phone, contactMessage)}
          target="_blank"
          rel="noopener noreferrer"
          onClick={markContacted}
          className="rounded-full bg-green-500 px-5 py-2 text-xs font-semibold uppercase tracking-wide text-white hover:bg-green-600"
        >
          Comunicarse con el cliente
        </a>
        {updating && <span className="text-xs text-zinc-400">Actualizando...</span>}
      </div>
    </div>
  );
}
