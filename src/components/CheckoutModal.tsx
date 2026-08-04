"use client";

import { useState } from "react";

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
}: {
  onCancel: () => void;
  onSubmit: (data: CheckoutData) => void;
  submitting: boolean;
  error: string | null;
}) {
  const [data, setData] = useState<CheckoutData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    city: "",
    province: "",
    postalCode: "",
  });

  const handleChange = (name: keyof CheckoutData, value: string) => {
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(data);
  };

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

          <p className="rounded-lg bg-pink-50 px-3 py-2 text-xs text-pink-600">
            📦 El costo de envío se coordina por WhatsApp según tu código postal.
          </p>

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
