"use client";

import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { buildWhatsappLink } from "@/lib/whatsapp";
import { CheckoutModal, type CheckoutData } from "@/components/CheckoutModal";
import { OrderConfirmationModal } from "@/components/OrderConfirmationModal";

const currencyFormatter = new Intl.NumberFormat("es-AR", {
  style: "currency",
  currency: "ARS",
  maximumFractionDigits: 0,
});

type Stage = "cart" | "checkout" | "success";

export function CartDrawer() {
  const { isOpen, closeCart, lines, totalPrice, updateQuantity, removeItem, clear } = useCart();
  const [stage, setStage] = useState<Stage>("cart");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const resetAndClose = () => {
    setStage("cart");
    setError(null);
    closeCart();
  };

  const handleCheckoutSubmit = async (data: CheckoutData) => {
    setSubmitting(true);
    setError(null);

    // Abrimos la pestaña ya mismo (dentro del gesto del usuario) para evitar
    // que el navegador bloquee el popup una vez resuelto el fetch.
    const whatsappWindow = window.open("", "_blank");

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          items: lines.map((line) => ({
            productId: line.productId,
            productName: line.name,
            size: line.size,
            quantity: line.quantity,
            unitPrice: line.price,
          })),
        }),
      });

      const responseData = await res.json();

      if (!res.ok) {
        whatsappWindow?.close();
        setError(responseData.error ?? "No se pudo confirmar el pedido.");
        setSubmitting(false);
        return;
      }

      const detail = lines
        .map((line) => `• ${line.quantity}x ${line.name} (talle ${line.size})`)
        .join("\n");
      const message = `🆕 Nuevo pedido de ${data.firstName} ${data.lastName}\n${detail}\n\nTotal: ${currencyFormatter.format(
        totalPrice
      )}\n\n📧 ${data.email}\n📱 ${data.phone}\n📍 ${data.city}, ${data.province} (CP ${data.postalCode})`;

      if (whatsappWindow) {
        whatsappWindow.location.href = buildWhatsappLink(message);
      }

      clear();
      setStage("success");
    } catch {
      whatsappWindow?.close();
      setError("Error de conexión. Intentá de nuevo.");
    } finally {
      setSubmitting(false);
    }
  };

  if (stage === "success") {
    return <OrderConfirmationModal onClose={resetAndClose} />;
  }

  if (stage === "checkout") {
    return (
      <CheckoutModal
        onCancel={() => setStage("cart")}
        onSubmit={handleCheckoutSubmit}
        submitting={submitting}
        error={error}
      />
    );
  }

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
              {lines.map((line) => (
                <li key={`${line.productId}-${line.size}`} className="flex items-center gap-3">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg bg-pink-100 text-xl">
                    {line.coverImage.startsWith("emoji:") ? (
                      line.coverImage.replace("emoji:", "")
                    ) : (
                      // eslint-disable-next-line @next/next/no-img-element -- small cart thumbnail, next/image not worth it here
                      <img
                        src={line.coverImage}
                        alt=""
                        className="h-14 w-14 rounded-lg object-cover"
                      />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-zinc-900">{line.name}</p>
                    <p className="text-xs text-zinc-500">
                      Talle {line.size} · {currencyFormatter.format(line.price)}
                    </p>
                    <div className="mt-1 flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => updateQuantity(line.productId, line.size, line.quantity - 1)}
                        className="h-6 w-6 rounded-full border border-pink-200 text-sm text-zinc-600 hover:border-pink-400"
                      >
                        −
                      </button>
                      <span className="text-sm text-zinc-800">{line.quantity}</span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(line.productId, line.size, line.quantity + 1)}
                        className="h-6 w-6 rounded-full border border-pink-200 text-sm text-zinc-600 hover:border-pink-400"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeItem(line.productId, line.size)}
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
          <button
            type="button"
            disabled={lines.length === 0}
            onClick={() => setStage("checkout")}
            className={`block w-full rounded-full py-3 text-center text-sm font-semibold uppercase tracking-wide text-white transition-colors ${
              lines.length === 0
                ? "pointer-events-none bg-zinc-300"
                : "bg-pink-400 hover:bg-pink-500"
            }`}
          >
            Continuar con la compra
          </button>
        </div>
      </div>
    </div>
  );
}
