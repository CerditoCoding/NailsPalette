import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { validateOrderPayload } from "@/lib/orderPayload";
import { allocateOrderNumber, isOrderNumberCollision } from "@/lib/orderNumber";
import { sendOrderEmail, getSiteUrl, getAdminNotificationEmail } from "@/lib/email";
import { formatOrderNumber } from "@/lib/orderStatus";
import { formatCurrency } from "@/lib/currency";

const MAX_ATTEMPTS = 2;

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const result = validateOrderPayload(body);
  if ("error" in result) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }
  const { data } = result;

  const itemsTotal = data.items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
  const total = itemsTotal + data.shippingEstimate;

  let order;
  let lastError: unknown;

  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
    try {
      order = await prisma.$transaction(async (tx) => {
        const orderNumber = await allocateOrderNumber(tx);
        return tx.order.create({
          data: {
            orderNumber,
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            phone: data.phone,
            city: data.city,
            province: data.province,
            postalCode: data.postalCode,
            shippingEstimate: data.shippingEstimate,
            total,
            items: {
              create: data.items.map((item) => ({
                productId: item.productId,
                productName: item.productName,
                size: item.size,
                quantity: item.quantity,
                unitPrice: item.unitPrice,
              })),
            },
          },
          include: { items: true },
        });
      });
      break;
    } catch (err) {
      lastError = err;
      if (!isOrderNumberCollision(err)) throw err;
      // Colisión de número de pedido entre dos altas concurrentes: se
      // reintenta una vez más con la pileta/secuencia ya actualizada.
    }
  }

  if (!order) throw lastError;

  // Los mails son un extra: sendOrderEmail nunca tira (atrapa sus propios
  // errores), así que esperarlos no le agrega riesgo a la confirmación del
  // pedido. Hace falta el await igual — en una función serverless, un
  // "fire and forget" sin esperar corre el riesgo de que el proceso se
  // congele apenas se manda la respuesta, cortando el envío a mitad de
  // camino sin que el mail llegue a salir.
  const adminEmail = getAdminNotificationEmail();

  await Promise.all([
    sendOrderEmail({
      to: order.email,
      subject: `Tu pedido #${formatOrderNumber(order.orderNumber)} en Nails Palette`,
      heading: "¡Gracias por elegir Nails Palette!",
      orderNumber: order.orderNumber,
      bodyLines: [
        "En el siguiente link, vas a poder acceder a tu pedido para ver el detalle y el estado del mismo:",
      ],
      ctaLabel: "Ver mi pedido",
      ctaUrl: `${getSiteUrl()}/pedido/${order.id}`,
      closingLine: "¡En breve nos vamos a estar comunicando contigo!",
    }),
    // Aviso a la dueña para que se comunique con la clienta — hasta que
    // tengamos WhatsApp Business, este mail reemplaza al popup de WhatsApp
    // que antes tenía que mandar la propia clienta a mano.
    adminEmail
      ? sendOrderEmail({
          to: adminEmail,
          subject: `🆕 Pedido #${formatOrderNumber(order.orderNumber)} — ${order.firstName} ${order.lastName}`,
          heading: "¡Nuevo pedido recibido!",
          orderNumber: order.orderNumber,
          bodyLines: [
            ...order.items.map(
              (item) => `• ${item.quantity}x ${item.productName} (talle ${item.size})`
            ),
            `Envío: ${order.shippingEstimate ? formatCurrency(order.shippingEstimate) : "a coordinar"}`,
            `Total: ${formatCurrency(order.total)}`,
            `📱 ${order.phone}`,
            `📧 ${order.email}`,
            `📍 ${order.city}, ${order.province} (CP ${order.postalCode})`,
          ],
          ctaLabel: "Ver en el panel",
          ctaUrl: `${getSiteUrl()}/admin/pedidos`,
          closingLine: "Comunicate con la clienta a la brevedad.",
        })
      : Promise.resolve(),
  ]);

  return NextResponse.json({ item: order }, { status: 201 });
}
