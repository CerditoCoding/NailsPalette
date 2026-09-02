"use client";

import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { SizeChart } from "@/components/SizeChart";

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
  const [showSizeChart, setShowSizeChart] = useState(false);

  const handleAdd = () => {
    if (!size) return;
    addItem(product, size);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="space-y-4">
      <div>
        <div className="mb-1 flex items-center justify-between">
          <label className="block text-xs font-semibold uppercase tracking-wide text-zinc-500">
            Talle
          </label>
          <button
            type="button"
            onClick={() => setShowSizeChart(true)}
            className="text-xs font-semibold text-pink-500 underline-offset-2 hover:text-pink-600 hover:underline"
          >
            Ver tabla de talles
          </button>
        </div>
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

      {showSizeChart && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/40 px-4 py-8">
          <div className="relative w-full max-w-2xl">
            <button
              type="button"
              onClick={() => setShowSizeChart(false)}
              aria-label="Cerrar"
              className="absolute -right-2 -top-2 flex h-8 w-8 items-center justify-center rounded-full bg-white text-2xl leading-none text-zinc-500 shadow-md hover:text-zinc-800"
            >
              ×
            </button>
            <SizeChart />
          </div>
        </div>
      )}
    </div>
  );
}
