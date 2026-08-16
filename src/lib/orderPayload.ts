export type OrderItemInput = {
  productId: string;
  productName: string;
  size: string;
  quantity: number;
  unitPrice: number;
};

export type OrderPayload = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  city: string;
  province: string;
  postalCode: string;
  shippingEstimate: number;
  items: OrderItemInput[];
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateOrderPayload(
  body: unknown
): { data: OrderPayload } | { error: string } {
  if (typeof body !== "object" || body === null) {
    return { error: "Datos inválidos." };
  }
  const b = body as Record<string, unknown>;

  const requiredStrings: (keyof OrderPayload)[] = [
    "firstName",
    "lastName",
    "email",
    "phone",
    "city",
    "province",
    "postalCode",
  ];

  for (const field of requiredStrings) {
    if (typeof b[field] !== "string" || !(b[field] as string).trim()) {
      return { error: "Completá todos los datos de contacto y envío." };
    }
  }

  const email = (b.email as string).trim();
  if (!EMAIL_REGEX.test(email)) {
    return { error: "El correo electrónico no es válido." };
  }

  let shippingEstimate = 0;
  if (b.shippingEstimate !== undefined) {
    const parsed = Number(b.shippingEstimate);
    if (!Number.isFinite(parsed) || parsed < 0) {
      return { error: "El estimado de envío no es válido." };
    }
    shippingEstimate = Math.round(parsed);
  }

  if (!Array.isArray(b.items) || b.items.length === 0) {
    return { error: "El carrito está vacío." };
  }

  const items: OrderItemInput[] = [];
  for (const raw of b.items) {
    if (typeof raw !== "object" || raw === null) return { error: "Ítem de pedido inválido." };
    const item = raw as Record<string, unknown>;
    if (typeof item.productId !== "string") return { error: "Ítem de pedido inválido." };
    if (typeof item.productName !== "string") return { error: "Ítem de pedido inválido." };
    if (typeof item.size !== "string") return { error: "Ítem de pedido inválido." };
    const quantity = Number(item.quantity);
    const unitPrice = Number(item.unitPrice);
    if (!Number.isFinite(quantity) || quantity <= 0) return { error: "Cantidad inválida." };
    if (!Number.isFinite(unitPrice) || unitPrice <= 0) return { error: "Precio inválido." };
    items.push({
      productId: item.productId,
      productName: item.productName,
      size: item.size,
      quantity: Math.round(quantity),
      unitPrice: Math.round(unitPrice),
    });
  }

  return {
    data: {
      firstName: (b.firstName as string).trim(),
      lastName: (b.lastName as string).trim(),
      email,
      phone: (b.phone as string).trim(),
      city: (b.city as string).trim(),
      province: (b.province as string).trim(),
      postalCode: (b.postalCode as string).trim(),
      shippingEstimate,
      items,
    },
  };
}
