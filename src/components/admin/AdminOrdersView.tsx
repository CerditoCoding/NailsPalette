"use client";

import { useMemo, useState } from "react";
import { OrderCard, type Order } from "@/components/admin/OrderCard";
import { ORDER_STATUSES, STATUS_LABELS } from "@/lib/orderStatus";

export function AdminOrdersView({ initialOrders }: { initialOrders: Order[] }) {
  const [orders, setOrders] = useState(initialOrders);
  const [syncedOrders, setSyncedOrders] = useState(initialOrders);
  const [selected, setSelected] = useState<Set<string>>(new Set(ORDER_STATUSES));

  // Cada vez que la página del admin vuelve a pedir los pedidos al server
  // (router.refresh() después de cambiar un estado, guardar seguimiento,
  // etc.), este componente recibe un `initialOrders` nuevo — sin esto, el
  // pedidos de arriba se queda para siempre con la foto del primer
  // montaje y un pedido filtrado y vuelto a mostrar "revive" con datos
  // viejos. Se ajusta durante el render (patrón recomendado por React
  // para "adjusting state when a prop changes"), no en un useEffect, para
  // no disparar un re-render en cascada.
  if (initialOrders !== syncedOrders) {
    setSyncedOrders(initialOrders);
    setOrders(initialOrders);
  }

  const toggleStatus = (status: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(status)) next.delete(status);
      else next.add(status);
      return next;
    });
  };

  const selectAllStatuses = () => setSelected(new Set(ORDER_STATUSES));

  const filtered = useMemo(
    () => orders.filter((order) => selected.has(order.status)),
    [orders, selected]
  );

  const handleDeleted = (id: string) => {
    setOrders((prev) => prev.filter((o) => o.id !== id));
  };

  if (orders.length === 0) {
    return <p className="text-sm text-zinc-500">Todavía no hay pedidos.</p>;
  }

  return (
    <div className="flex flex-col gap-6 sm:flex-row">
      <aside className="w-full shrink-0 sm:w-52">
        <h3 className="mb-3 text-sm font-bold uppercase tracking-wide text-zinc-900">Estado</h3>
        <ul className="space-y-2 text-sm text-zinc-600">
          {ORDER_STATUSES.map((status) => (
            <li key={status}>
              <label className="flex cursor-pointer items-center gap-2">
                <input
                  type="checkbox"
                  checked={selected.has(status)}
                  onChange={() => toggleStatus(status)}
                  className="h-4 w-4 rounded border-zinc-300 text-pink-500 focus:ring-pink-400"
                />
                {STATUS_LABELS[status]}
              </label>
            </li>
          ))}
        </ul>
        <button
          type="button"
          onClick={selectAllStatuses}
          className="mt-3 text-xs font-semibold uppercase tracking-wide text-pink-500 hover:text-pink-600"
        >
          Marcar todos
        </button>
      </aside>

      <div className="flex-1 space-y-4">
        {filtered.length === 0 ? (
          <p className="text-sm text-zinc-500">Ningún pedido coincide con los filtros elegidos.</p>
        ) : (
          filtered.map((order) => (
            <OrderCard key={order.id} order={order} onDeleted={handleDeleted} />
          ))
        )}
      </div>
    </div>
  );
}
