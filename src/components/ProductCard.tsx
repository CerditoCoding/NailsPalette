import Link from "next/link";
import Image from "next/image";
import type { CatalogProduct } from "@/types/catalog";
import { emojiFromPlaceholder, gradientFor, isEmojiPlaceholder } from "@/lib/placeholderGradient";

const currencyFormatter = new Intl.NumberFormat("es-AR", {
  style: "currency",
  currency: "ARS",
  maximumFractionDigits: 0,
});

export function ProductCard({ product }: { product: CatalogProduct }) {
  const showEmoji = isEmojiPlaceholder(product.coverImage);

  return (
    <Link
      href={`/producto/${product.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-pink-100 bg-white shadow-sm transition-shadow hover:shadow-md"
    >
      {showEmoji ? (
        <div
          className={`flex aspect-square items-center justify-center bg-gradient-to-br ${gradientFor(product.id)}`}
        >
          <span className="text-5xl drop-shadow-sm transition-transform group-hover:scale-110">
            {emojiFromPlaceholder(product.coverImage)}
          </span>
        </div>
      ) : (
        <div className="relative aspect-square overflow-hidden">
          <Image
            src={product.coverImage}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 100vw, 33vw"
            className="object-cover transition-transform group-hover:scale-105"
          />
        </div>
      )}
      <div className="flex flex-1 flex-col gap-2 p-4">
        <p className="text-xs font-medium uppercase tracking-wide text-pink-500">
          {product.collection} · {product.shape} · {product.designLevel}
        </p>
        <h3 className="text-sm font-semibold uppercase tracking-wide text-zinc-900">
          {product.name}
        </h3>
        <p className="text-base font-bold text-zinc-900">
          {currencyFormatter.format(product.price)}
        </p>
        <span className="mt-2 block w-full rounded-full bg-pink-400 py-2 text-center text-xs font-semibold uppercase tracking-wide text-white transition-colors group-hover:bg-pink-500">
          Ver diseño
        </span>
      </div>
    </Link>
  );
}
