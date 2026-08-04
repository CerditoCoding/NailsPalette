"use client";

import { useState } from "react";
import type { TagType } from "@/lib/tagTypes";

type Tag = { id: string; name: string };

export function TagManager({
  type,
  label,
  placeholder,
  initialItems,
}: {
  type: TagType;
  label: string;
  placeholder: string;
  initialItems: Tag[];
}) {
  const [items, setItems] = useState(initialItems);
  const [name, setName] = useState("");
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
      body: JSON.stringify({ name: name.trim() }),
    });
    const data = await res.json();

    if (!res.ok) {
      setError(data.error ?? "No se pudo crear la etiqueta.");
      setLoading(false);
      return;
    }

    setItems((prev) => [...prev, data.item].sort((a, b) => a.name.localeCompare(b.name)));
    setName("");
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
            className="flex items-center justify-between rounded-lg bg-pink-50/60 px-3 py-2 text-sm text-zinc-800"
          >
            {item.name}
            <button
              type="button"
              onClick={() => handleDelete(item.id)}
              disabled={deletingId === item.id}
              className="text-xs font-medium text-zinc-400 hover:text-red-500 disabled:opacity-50"
            >
              {deletingId === item.id ? "..." : "Eliminar"}
            </button>
          </li>
        ))}
      </ul>

      <form onSubmit={handleAdd} className="flex gap-2">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={placeholder}
          className="flex-1 rounded-lg border border-pink-200 px-3 py-1.5 text-sm text-zinc-900 focus:border-pink-400 focus:outline-none"
        />
        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-pink-400 px-4 py-1.5 text-sm font-semibold text-white hover:bg-pink-500 disabled:opacity-60"
        >
          Agregar
        </button>
      </form>

      {error && <p className="mt-2 text-xs text-red-500">{error}</p>}
    </div>
  );
}
