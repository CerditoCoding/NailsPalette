"use client";

import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { formatCurrency } from "@/lib/currency";
import { CheckoutModal, type CheckoutData } from "@/components/CheckoutModal";
import { OrderConfirmationModal } from "@/components/OrderConfirmationModal";

type Stage = "cart" | "checkout" | "success";
type Shipping = { zoneName: string; price: number };

export function CartDrawer() {
  const { isOpen, closeCart, lines, totalPrice, updateQuantity, removeItem, clear } = useCart();
  const [stage, setStage] = useState<Stage>("cart");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [postalCode, setPostalCode] = useState("");
  const [shipping, setShipping] = useState<Shipping | null>(null);
  const [shippingError, setShippingError] = useState<string | null>(null);
  const [calculatingShipping, setCalculatingShipping] = useState(false);

  if (!isOpen) return null;

  const grandTotal = totalPrice + (shipping?.price ?? 0);

  const resetAndClose = () => {
    setStage("cart");
    setError(null);
    setPostalCode("");
    setShipping(null);
    setShippingError(null);
    closeCart();
  };

  const handleCalculateShipping = async () => {
    if (!postalCode.trim()) return;
    setCalculatingShipping(true);
    setShippingError(null);
    setShipping(null);

    try {
      const res = await fetch("/api/shipping/estimate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postalCode }),
      });
      const data = await res.json();

      if (!res.ok) {
        setShippingError(data.error ?? "No se pudo calcular el envío.");
        return;
      }
      setShipping({ zoneName: data.zoneName, price: data.price });
    } catch {
      setShippingError("Error de conexión. Intentá de nuevo.");
    } finally {
      setCalculatingShipping(false);
    }
  };

  const handleCheckoutSubmit = async (data: CheckoutData) => {
    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          shippingEstimate: shipping?.price ?? 0,
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
        setError(responseData.error ?? "No se pudo confirmar el pedido.");
        setSubmitting(false);
        return;
      }

      // El aviso a la dueña ahora lo manda el server por mail apenas se crea
      // el pedido — la clienta ya no tiene que mandar nada más por WhatsApp.
      clear();
      setStage("success");
    } catch {
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
        initialPostalCode={postalCode}
        subtotal={totalPrice}
        shipping={shipping}
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
            <>
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
                        Talle {line.size} · {formatCurrency(line.price)}
                      </p>
                      <div className="mt-1 flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() =>
                            updateQuantity(line.productId, line.size, line.quantity - 1)
                          }
                          className="h-6 w-6 rounded-full border border-pink-200 text-sm text-zinc-600 hover:border-pink-400"
                        >
                          −
                        </button>
                        <span className="text-sm text-zinc-800">{line.quantity}</span>
                        <button
                          type="button"
                          onClick={() =>
                            updateQuantity(line.productId, line.size, line.quantity + 1)
                          }
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

              <div className="mt-6 rounded-lg border border-pink-100 p-3">
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-zinc-500">
                  Calculá tu envío
                </p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={postalCode}
                    onChange={(e) => {
                      setPostalCode(e.target.value);
                      setShipping(null);
                      setShippingError(null);
                    }}
                    placeholder="Código postal"
                    className="min-w-0 flex-1 rounded-lg border border-pink-200 px-3 py-1.5 text-sm text-zinc-900 focus:border-pink-400 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleCalculateShipping}
                    disabled={calculatingShipping || !postalCode.trim()}
                    className="shrink-0 rounded-lg bg-pink-400 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-white hover:bg-pink-500 disabled:opacity-60"
                  >
                    {calculatingShipping ? "..." : "Calcular"}
                  </button>
                </div>
                {shipping && (
                  <p className="mt-2 text-xs font-medium text-green-600">
                    Envío a {shipping.zoneName}: {formatCurrency(shipping.price)}
                  </p>
                )}
                {shippingError && (
                  <p className="mt-2 text-xs text-pink-500">{shippingError}</p>
                )}
              </div>
            </>
          )}
        </div>

        <div className="border-t border-pink-100 px-5 py-4">
          <div className="mb-3 space-y-1 text-sm">
            <div className="flex items-center justify-between text-zinc-600">
              <span>Subtotal</span>
              <span>{formatCurrency(totalPrice)}</span>
            </div>
            <div className="flex items-center justify-between text-zinc-600">
              <span>Envío</span>
              <span>{shipping ? formatCurrency(shipping.price) : "—"}</span>
            </div>
            <div className="flex items-center justify-between font-semibold text-zinc-900">
              <span>Total</span>
              <span>{formatCurrency(grandTotal)}</span>
            </div>
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
