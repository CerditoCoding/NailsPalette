export const ORDER_STATUSES = [
  "NUEVO",
  "EN_PROCESO",
  "A_DESPACHAR",
  "ENVIADO",
  "RECIBIDO",
  "CERRADO",
] as const;

export type OrderStatus = (typeof ORDER_STATUSES)[number];

export function isOrderStatus(value: unknown): value is OrderStatus {
  return typeof value === "string" && (ORDER_STATUSES as readonly string[]).includes(value);
}

export const STATUS_LABELS: Record<OrderStatus, string> = {
  NUEVO: "Nuevo",
  EN_PROCESO: "En proceso",
  A_DESPACHAR: "A despachar",
  ENVIADO: "Enviado",
  RECIBIDO: "Recibido",
  CERRADO: "Cerrado",
};

export const STATUS_BADGE_STYLES: Record<OrderStatus, string> = {
  NUEVO: "bg-pink-100 text-pink-600",
  EN_PROCESO: "bg-amber-100 text-amber-700",
  A_DESPACHAR: "bg-blue-100 text-blue-700",
  ENVIADO: "bg-indigo-100 text-indigo-700",
  RECIBIDO: "bg-green-100 text-green-700",
  CERRADO: "bg-zinc-200 text-zinc-500",
};

/** Controla el "look" de toda la tarjeta del pedido, tanto en el admin como
 * en la página pública del pedido, para que ambas nunca queden desalineadas. */
export const STATUS_CARD_STYLES: Record<OrderStatus, string> = {
  NUEVO: "border border-pink-100",
  EN_PROCESO: "border border-pink-100",
  A_DESPACHAR: "border border-pink-100",
  ENVIADO: "border border-pink-100",
  RECIBIDO: "border-2 border-green-400",
  CERRADO: "opacity-60 grayscale",
};

export function formatOrderNumber(n: number): string {
  return String(n).padStart(5, "0");
}
