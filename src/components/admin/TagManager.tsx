"use client";

import { useState } from "react";
import type { TagType } from "@/lib/tagTypes";
import { formatCurrency } from "@/lib/currency";

type Tag = { id: string; name: string; priceModifier?: number };

export function TagManager({
  type,
  label,
  placeholder,
  initialItems,
  withPrice = false,
}: {
  type: TagType;
  label: string;
  placeholder: string;
  initialItems: Tag[];
  /** Muestra un campo extra para asignar un recargo de precio a cada etiqueta. */
  withPrice?: boolean;
}) {
  const [items, setItems] = useState(initialItems);
  const [name, setName] = useState("");
  const [priceModifier, setPriceModifier] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setLoading(true);
    setError(null);

    const res = await fetch(`/api/admin/tags/${type}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: name.trim(),
        ...(withPrice ? { priceModifier: Number(priceModifier) || 0 } : {}),
      }),
    });
    const data = await res.json();

    if (!res.ok) {
      setError(data.error ?? "No se pudo crear la etiqueta.");
      setLoading(false);
      return;
    }

    setItems((prev) => [...prev, data.item].sort((a, b) => a.name.localeCompare(b.name)));
    setName("");
    setPriceModifier("");
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    setError(null);

    const res = await fetch(`/api/admin/tags/${type}/${id}`, { method: "DELETE" });
    const data = await res.json();

    if (!res.ok) {
      setError(data.error ?? "No se pudo eliminar.");
      setDeletingId(null);
      return;
    }

    setItems((prev) => prev.filter((item) => item.id !== id));
    setDeletingId(null);
  };

  return (
    <div className="rounded-2xl border border-pink-100 bg-white p-5 shadow-sm">
      <h2 className="mb-4 text-sm font-bold uppercase tracking-wide text-zinc-900">
        {label}
      </h2>

      <ul className="mb-4 space-y-2">
        {items.length === 0 && (
          <li className="text-sm text-zinc-400">Todavía no hay {label.toLowerCase()}.</li>
        )}
        {items.map((item) => (
          <li
            key={item.id}
            className="flex items-center justify-between gap-2 rounded-lg bg-pink-50/60 px-3 py-2 text-sm text-zinc-800"
          >
            <span className="truncate">{item.name}</span>
            <span className="flex shrink-0 items-center gap-2">
              {withPrice && !!item.priceModifier && (
                <span className="text-xs font-semibold text-pink-500">
                  +{formatCurrency(item.priceModifier)}
                </span>
              )}
              <button
                type="button"
                onClick={() => handleDelete(item.id)}
                disabled={deletingId === item.id}
                className="text-xs font-medium text-zinc-400 hover:text-red-500 disabled:opacity-50"
              >
                {deletingId === item.id ? "..." : "Eliminar"}
              </button>
            </span>
          </li>
        ))}
      </ul>

      <form onSubmit={handleAdd} className="space-y-2">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={placeholder}
          className="w-full rounded-lg border border-pink-200 px-3 py-1.5 text-sm text-zinc-900 focus:border-pink-400 focus:outline-none"
        />
        {withPrice && (
          <input
            type="number"
            min={0}
            value={priceModifier}
            onChange={(e) => setPriceModifier(e.target.value)}
            placeholder="Recargo ($, opcional)"
            className="w-full rounded-lg border border-pink-200 px-3 py-1.5 text-sm text-zinc-900 focus:border-pink-400 focus:outline-none"
          />
        )}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-pink-400 py-1.5 text-sm font-semibold text-white hover:bg-pink-500 disabled:opacity-60"
        >
          Agregar
        </button>
      </form>

      {error && <p className="mt-2 text-xs text-red-500">{error}</p>}
    </div>
  );
}
