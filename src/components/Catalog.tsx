"use client";

import { useMemo, useState } from "react";
import type { CatalogProduct } from "@/types/catalog";
import { ProductCard } from "@/components/ProductCard";
import { Sidebar, type Filters } from "@/components/Sidebar";

type SortOption = "destacado" | "precio-asc" | "precio-desc";

const SORT_LABELS: Record<SortOption, string> = {
  destacado: "Destacado",
  "precio-asc": "Precio: menor a mayor",
  "precio-desc": "Precio: mayor a menor",
};

export function Catalog({
  products,
  collections,
  shapes,
  sizes,
}: {
  products: CatalogProduct[];
  collections: string[];
  shapes: string[];
  sizes: string[];
}) {
  const [filters, setFilters] = useState<Filters>({
    collection: "Todas",
    shapes: [],
    sizes: [],
  });
  const [sort, setSort] = useState<SortOption>("destacado");

  const filtered = useMemo(() => {
    let list = products.filter((product) => {
      const matchesCollection =
        filters.collection === "Todas" || product.collection === filters.collection;
      const matchesShape =
        filters.shapes.length === 0 || filters.shapes.includes(product.shape);
      const matchesSize =
        filters.sizes.length === 0 ||
        filters.sizes.some((size) => product.sizes.includes(size));
      return matchesCollection && matchesShape && matchesSize;
    });

    if (sort === "precio-asc") {
      list = [...list].sort((a, b) => a.price - b.price);
    } else if (sort === "precio-desc") {
      list = [...list].sort((a, b) => b.price - a.price);
    }

    return list;
  }, [products, filters, sort]);

  return (
    <section id="catalogo" className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-zinc-500">
          Inicio / <span className="font-semibold text-zinc-900">Catálogo</span>
        </p>
        <label className="flex items-center gap-2 text-sm text-zinc-600">
          Ordenar por
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortOption)}
            className="rounded-md border border-pink-200 px-3 py-1.5 text-sm text-zinc-900 focus:border-pink-400 focus:outline-none"
          >
            {Object.entries(SORT_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="flex flex-col gap-8 sm:flex-row">
        <Sidebar
          collections={collections}
          shapes={shapes}
          sizes={sizes}
          filters={filters}
          onChange={setFilters}
        />

        <div className="flex-1">
          {filtered.length === 0 ? (
            <p className="py-16 text-center text-sm text-zinc-500">
              No hay diseños que coincidan con esos filtros.
            </p>
          ) : (
            <div className="grid grid-cols-1 gap-6 xs:grid-cols-2 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
