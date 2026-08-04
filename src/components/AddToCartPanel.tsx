"use client";

import { useState } from "react";
import { useCart } from "@/context/CartContext";

export function AddToCartPanel({
  product,
  sizes,
}: {
  product: { id: string; slug: string; name: string; coverImage: string; price: number };
  sizes: string[];
}) {
  const { addItem } = useCart();
  const [size, setSize] = useState(sizes[0] ?? "");
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    if (!size) return;
    addItem(product, size);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-zinc-500">
          Talle
        </label>
        {sizes.length === 0 ? (
          <p className="text-sm text-zinc-400">Sin talles disponibles.</p>
        ) : (
          <select
            value={size}
            onChange={(e) => setSize(e.target.value)}
            className="w-full rounded-lg border border-pink-200 px-3 py-2 text-sm text-zinc-900 focus:border-pink-400 focus:outline-none sm:w-48"
          >
            {sizes.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        )}
      </div>

      <button
        type="button"
        onClick={handleAdd}
        disabled={sizes.length === 0}
        className="w-full rounded-full bg-pink-400 py-3 text-sm font-semibold uppercase tracking-wide text-white transition-colors hover:bg-pink-500 disabled:opacity-50 sm:w-auto sm:px-8"
      >
        {added ? "¡Agregado! ✓" : "Agregar al carrito"}
      </button>
    </div>
  );
}
