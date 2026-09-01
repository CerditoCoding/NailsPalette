"use client";

import { useMemo, useState } from "react";
import { OrderCard, type Order } from "@/components/admin/OrderCard";
import { ORDER_STATUSES, STATUS_LABELS } from "@/lib/orderStatus";

export function AdminOrdersView({ initialOrders }: { initialOrders: Order[] }) {
  const [orders, setOrders] = useState(initialOrders);
  const [selected, setSelected] = useState<Set<string>>(new Set(ORDER_STATUSES));

  const toggleStatus = (status: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(status)) next.delete(status);
      else next.add(status);
      return next;
    });
  };

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
