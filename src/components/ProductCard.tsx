import type { Product } from "@/data/products";

const currencyFormatter = new Intl.NumberFormat("es-AR", {
  style: "currency",
  currency: "ARS",
  maximumFractionDigits: 0,
});

export function ProductCard({
  product,
  onAdd,
}: {
  product: Product;
  onAdd: (productId: string) => void;
}) {
  return (
    <div className="group flex flex-col overflow-hidden rounded-2xl border border-pink-100 bg-white shadow-sm transition-shadow hover:shadow-md">
      <div
        className={`flex aspect-square items-center justify-center bg-gradient-to-br ${product.gradient}`}
      >
        <span className="text-5xl drop-shadow-sm transition-transform group-hover:scale-110">
          {product.emoji}
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <p className="text-xs font-medium uppercase tracking-wide text-pink-500">
          {product.collection} · {product.shape} · Talle {product.size}
        </p>
        <h3 className="text-sm font-semibold uppercase tracking-wide text-zinc-900">
          {product.name}
        </h3>
        <p className="text-base font-bold text-zinc-900">
          {currencyFormatter.format(product.price)}
        </p>
        <button
          type="button"
          onClick={() => onAdd(product.id)}
          className="mt-2 w-full rounded-full bg-pink-400 py-2 text-xs font-semibold uppercase tracking-wide text-white transition-colors hover:bg-pink-500"
        >
          Agregar al carrito
        </button>
      </div>
    </div>
  );
}
