"use client";

import { useState } from "react";
import { formatCurrency } from "@/lib/currency";

type Zone = { id: string; name: string; cpFrom: number; cpTo: number; price: number };

export function ShippingZoneManager({ initialZones }: { initialZones: Zone[] }) {
  const [zones, setZones] = useState(initialZones);
  const [name, setName] = useState("");
  const [cpFrom, setCpFrom] = useState("");
  const [cpTo, setCpTo] = useState("");
  const [price, setPrice] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const res = await fetch("/api/admin/shipping", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: name.trim(),
        cpFrom: Number(cpFrom),
        cpTo: Number(cpTo),
        price: Number(price),
      }),
    });
    const data = await res.json();

    if (!res.ok) {
      setError(data.error ?? "No se pudo crear la zona.");
      setLoading(false);
      return;
    }

    setZones((prev) => [...prev, data.item].sort((a, b) => a.cpFrom - b.cpFrom));
    setName("");
    setCpFrom("");
    setCpTo("");
    setPrice("");
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    setError(null);

    const res = await fetch(`/api/admin/shipping/${id}`, { method: "DELETE" });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "No se pudo eliminar la zona.");
      setDeletingId(null);
      return;
    }

    setZones((prev) => prev.filter((z) => z.id !== id));
    setDeletingId(null);
  };

  return (
    <div className="max-w-2xl">
      <div className="mb-6 overflow-hidden rounded-2xl border border-pink-100 bg-white">
        <table className="w-full text-sm">
          <thead className="bg-pink-50/60 text-left text-xs uppercase tracking-wide text-zinc-500">
            <tr>
              <th className="px-4 py-3">Zona</th>
              <th className="px-4 py-3">Rango de CP</th>
              <th className="px-4 py-3">Precio</th>
              <th className="px-4 py-3 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {zones.map((zone) => (
              <tr key={zone.id} className="border-t border-pink-50">
                <td className="px-4 py-3 font-medium text-zinc-900">{zone.name}</td>
                <td className="px-4 py-3 text-zinc-600">
                  {zone.cpFrom} – {zone.cpTo}
                </td>
                <td className="px-4 py-3 text-zinc-900">{formatCurrency(zone.price)}</td>
                <td className="px-4 py-3 text-right">
                  <button
                    type="button"
                    onClick={() => handleDelete(zone.id)}
                    disabled={deletingId === zone.id}
                    className="text-xs font-medium text-zinc-400 hover:text-red-500 disabled:opacity-50"
                  >
                    {deletingId === zone.id ? "..." : "Eliminar"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {zones.length === 0 && (
          <p className="px-4 py-8 text-center text-sm text-zinc-400">
            Todavía no cargaste ninguna zona de envío.
          </p>
        )}
      </div>

      <form
        onSubmit={handleAdd}
        className="space-y-3 rounded-2xl border border-pink-100 bg-white p-5 shadow-sm"
      >
        <h3 className="text-sm font-bold uppercase tracking-wide text-zinc-900">Nueva zona</h3>
        <div>
          <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-zinc-500">
            Nombre
          </label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ej. CABA, GBA, Interior"
            className="w-full rounded-lg border border-pink-200 px-3 py-1.5 text-sm text-zinc-900 focus:border-pink-400 focus:outline-none"
          />
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-zinc-500">
              CP desde
            </label>
            <input
              type="number"
              required
              min={0}
              value={cpFrom}
              onChange={(e) => setCpFrom(e.target.value)}
              className="w-full rounded-lg border border-pink-200 px-3 py-1.5 text-sm text-zinc-900 focus:border-pink-400 focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-zinc-500">
              CP hasta
            </label>
            <input
              type="number"
              required
              min={0}
              value={cpTo}
              onChange={(e) => setCpTo(e.target.value)}
              className="w-full rounded-lg border border-pink-200 px-3 py-1.5 text-sm text-zinc-900 focus:border-pink-400 focus:outline-none"
            />
          </div>
          <div className="col-span-2 sm:col-span-1">
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-zinc-500">
              Precio ($)
            </label>
            <input
              type="number"
              required
              min={0}
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full rounded-lg border border-pink-200 px-3 py-1.5 text-sm text-zinc-900 focus:border-pink-400 focus:outline-none"
            />
          </div>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-pink-400 py-1.5 text-sm font-semibold text-white hover:bg-pink-500 disabled:opacity-60"
        >
          Agregar zona
        </button>
        {error && <p className="text-xs text-red-500">{error}</p>}
      </form>
    </div>
  );
}
