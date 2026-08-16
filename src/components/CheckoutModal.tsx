"use client";

import { useState } from "react";
import { formatCurrency } from "@/lib/currency";

export type CheckoutData = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  city: string;
  province: string;
  postalCode: string;
};

const FIELDS: { name: keyof CheckoutData; label: string; type: string }[] = [
  { name: "firstName", label: "Nombre", type: "text" },
  { name: "lastName", label: "Apellido", type: "text" },
  { name: "email", label: "Correo electrónico", type: "email" },
  { name: "phone", label: "Número de teléfono", type: "tel" },
  { name: "city", label: "Ciudad", type: "text" },
  { name: "province", label: "Provincia", type: "text" },
  { name: "postalCode", label: "Código postal", type: "text" },
];

export function CheckoutModal({
  onCancel,
  onSubmit,
  submitting,
  error,
  initialPostalCode,
  subtotal,
  shipping,
}: {
  onCancel: () => void;
  onSubmit: (data: CheckoutData) => void;
  submitting: boolean;
  error: string | null;
  initialPostalCode?: string;
  subtotal: number;
  shipping: { zoneName: string; price: number } | null;
}) {
  const [data, setData] = useState<CheckoutData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    city: "",
    province: "",
    postalCode: initialPostalCode ?? "",
  });

  const handleChange = (name: keyof CheckoutData, value: string) => {
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(data);
  };

  const total = subtotal + (shipping?.price ?? 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-3xl bg-white p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-zinc-900">Datos de contacto y envío</h2>
          <button
            type="button"
            onClick={onCancel}
            className="text-2xl leading-none text-zinc-400 hover:text-zinc-700"
            aria-label="Cerrar"
          >
            ×
          </button>
        </div>

        <div className="mb-4 space-y-1 rounded-lg bg-pink-50/60 px-3 py-2 text-sm text-zinc-700">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>{formatCurrency(subtotal)}</span>
          </div>
          <div className="flex justify-between">
            <span>Envío{shipping ? ` (${shipping.zoneName})` : ""}</span>
            <span>{shipping ? formatCurrency(shipping.price) : "a coordinar"}</span>
          </div>
          <div className="flex justify-between border-t border-pink-100 pt-1 font-semibold text-zinc-900">
            <span>Total</span>
            <span>{formatCurrency(total)}</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          {FIELDS.map((field) => (
            <div key={field.name}>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-zinc-500">
                {field.label}
              </label>
              <input
                type={field.type}
                required
                value={data[field.name]}
                onChange={(e) => handleChange(field.name, e.target.value)}
                className="w-full rounded-lg border border-pink-200 px-3 py-2 text-sm text-zinc-900 focus:border-pink-400 focus:outline-none"
              />
            </div>
          ))}

          {!shipping && (
            <p className="rounded-lg bg-pink-50 px-3 py-2 text-xs text-pink-600">
              📦 Todavía no calculaste el envío en el carrito — lo coordinamos por WhatsApp según
              tu código postal.
            </p>
          )}

          {error && <p className="text-sm text-red-500">{error}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-full bg-pink-400 py-3 text-sm font-semibold uppercase tracking-wide text-white hover:bg-pink-500 disabled:opacity-60"
          >
            {submitting ? "Procesando..." : "Comprar"}
          </button>
        </form>
      </div>
    </div>
  );
}
