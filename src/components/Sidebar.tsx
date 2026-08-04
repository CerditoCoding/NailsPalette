export type Filters = {
  collection: string;
  shapes: string[];
  sizes: string[];
};

export function Sidebar({
  collections,
  shapes,
  sizes,
  filters,
  onChange,
}: {
  collections: string[];
  shapes: string[];
  sizes: string[];
  filters: Filters;
  onChange: (filters: Filters) => void;
}) {
  const toggleShape = (shape: string) => {
    const next = filters.shapes.includes(shape)
      ? filters.shapes.filter((s) => s !== shape)
      : [...filters.shapes, shape];
    onChange({ ...filters, shapes: next });
  };

  const toggleSize = (size: string) => {
    const next = filters.sizes.includes(size)
      ? filters.sizes.filter((s) => s !== size)
      : [...filters.sizes, size];
    onChange({ ...filters, sizes: next });
  };

  return (
    <aside className="w-full shrink-0 space-y-8 sm:w-56">
      <div>
        <h3 className="mb-3 text-sm font-bold uppercase tracking-wide text-zinc-900">
          Colecciones
        </h3>
        <ul className="space-y-2 text-sm text-zinc-600">
          {["Todas", ...collections].map((collection) => (
            <li key={collection}>
              <button
                type="button"
                onClick={() => onChange({ ...filters, collection })}
                className={`transition-colors hover:text-pink-500 ${
                  filters.collection === collection
                    ? "font-semibold text-pink-500"
                    : ""
                }`}
              >
                {collection}
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h3 className="mb-3 text-sm font-bold uppercase tracking-wide text-zinc-900">
          Filtros
        </h3>

        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-zinc-500">
          Forma
        </p>
        <ul className="mb-4 space-y-2 text-sm text-zinc-600">
          {shapes.map((shape) => (
            <li key={shape}>
              <label className="flex cursor-pointer items-center gap-2">
                <input
                  type="checkbox"
                  checked={filters.shapes.includes(shape)}
                  onChange={() => toggleShape(shape)}
                  className="h-4 w-4 rounded border-zinc-300 text-pink-500 focus:ring-pink-400"
                />
                {shape}
              </label>
            </li>
          ))}
        </ul>

        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-zinc-500">
          Talle
        </p>
        <ul className="space-y-2 text-sm text-zinc-600">
          {sizes.map((size) => (
            <li key={size}>
              <label className="flex cursor-pointer items-center gap-2">
                <input
                  type="checkbox"
                  checked={filters.sizes.includes(size)}
                  onChange={() => toggleSize(size)}
                  className="h-4 w-4 rounded border-zinc-300 text-pink-500 focus:ring-pink-400"
                />
                {size}
              </label>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
