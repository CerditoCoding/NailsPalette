"use client";

import { useCart } from "@/context/CartContext";
import { buildWhatsappLink } from "@/lib/whatsapp";

const currencyFormatter = new Intl.NumberFormat("es-AR", {
  style: "currency",
  currency: "ARS",
  maximumFractionDigits: 0,
});

export function CartDrawer() {
  const { isOpen, closeCart, lines, totalPrice, updateQuantity, removeItem } = useCart();

  if (!isOpen) return null;

  const message = buildOrderMessage(lines, totalPrice);

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <button
        type="button"
        aria-label="Cerrar carrito"
        onClick={closeCart}
        className="absolute inset-0 bg-black/40"
      />
      <div className="relative flex h-full w-full max-w-sm flex-col bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-pink-100 px-5 py-4">
          <h2 className="text-lg font-semibold text-zinc-900">Tu pedido</h2>
          <button
            type="button"
            onClick={closeCart}
            className="text-2xl leading-none text-zinc-400 hover:text-zinc-700"
            aria-label="Cerrar"
          >
            ×
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4">
          {lines.length === 0 ? (
            <p className="mt-10 text-center text-sm text-zinc-500">
              Todavía no agregaste diseños.
            </p>
          ) : (
            <ul className="space-y-4">
              {lines.map(({ product, quantity }) => (
                <li key={product.id} className="flex items-center gap-3">
                  <div
                    className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br ${product.gradient} text-xl`}
                  >
                    {product.emoji}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-zinc-900">{product.name}</p>
                    <p className="text-xs text-zinc-500">
                      {currencyFormatter.format(product.price)}
                    </p>
                    <div className="mt-1 flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => updateQuantity(product.id, quantity - 1)}
                        className="h-6 w-6 rounded-full border border-pink-200 text-sm text-zinc-600 hover:border-pink-400"
                      >
                        −
                      </button>
                      <span className="text-sm text-zinc-800">{quantity}</span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(product.id, quantity + 1)}
                        className="h-6 w-6 rounded-full border border-pink-200 text-sm text-zinc-600 hover:border-pink-400"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeItem(product.id)}
                    className="text-xs font-medium text-zinc-400 hover:text-pink-500"
                  >
                    Quitar
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="border-t border-pink-100 px-5 py-4">
          <div className="mb-3 flex items-center justify-between text-sm font-semibold text-zinc-900">
            <span>Total</span>
            <span>{currencyFormatter.format(totalPrice)}</span>
          </div>
          <a
            href={buildWhatsappLink(message)}
            target="_blank"
            rel="noopener noreferrer"
            aria-disabled={lines.length === 0}
            className={`block w-full rounded-full py-3 text-center text-sm font-semibold uppercase tracking-wide text-white transition-colors ${
              lines.length === 0
                ? "pointer-events-none bg-zinc-300"
                : "bg-green-500 hover:bg-green-600"
            }`}
          >
            Finalizar pedido por WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}

function buildOrderMessage(
  lines: { product: { name: string; price: number }; quantity: number }[],
  totalPrice: number
) {
  if (lines.length === 0) {
    return "¡Hola! Quiero hacer una consulta sobre los press on.";
  }

  const detail = lines
    .map((line) => `• ${line.quantity}x ${line.product.name}`)
    .join("\n");

  return `¡Hola! Quiero coordinar este pedido:\n${detail}\n\nTotal estimado: ${currencyFormatter.format(
    totalPrice
  )}`;
}
