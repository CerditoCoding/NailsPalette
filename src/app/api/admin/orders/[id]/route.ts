import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { STATUS_LABELS, isOrderStatus } from "@/lib/orderStatus";
import { sendOrderEmail, getSiteUrl } from "@/lib/email";
import { releaseOrderNumber } from "@/lib/orderNumber";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json().catch(() => null) as
    | { status?: unknown; trackingCode?: unknown; trackingUrl?: unknown; shippingEstimate?: unknown }
    | null;

  const status = body?.status;
  if (!isOrderStatus(status)) {
    return NextResponse.json({ error: "Estado inválido." }, { status: 400 });
  }

  const trackingCode = typeof body?.trackingCode === "string" ? body.trackingCode : undefined;
  const trackingUrl = typeof body?.trackingUrl === "string" ? body.trackingUrl : undefined;

  let shippingEstimate: number | undefined;
  if (body?.shippingEstimate !== undefined) {
    const parsed = Number(body.shippingEstimate);
    if (!Number.isFinite(parsed) || parsed < 0) {
      return NextResponse.json({ error: "El costo de envío no es válido." }, { status: 400 });
    }
    shippingEstimate = Math.round(parsed);
  }

  const before = await prisma.order.findUnique({ where: { id }, include: { items: true } });
  if (!before) {
    return NextResponse.json({ error: "No se encontró el pedido." }, { status: 404 });
  }

  // Mientras no tengamos la cotización en vivo de Correo Argentino, el envío
  // se carga a mano desde el pedido — al guardarlo, el total se recalcula
  // solo a partir de los ítems más el nuevo costo de envío.
  const total =
    shippingEstimate !== undefined
      ? before.items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0) + shippingEstimate
      : undefined;

  const item = await prisma.order.update({
    where: { id },
    data: { status, trackingCode, trackingUrl, shippingEstimate, total },
  });

  // Solo avisamos por mail si el estado realmente cambió — si el admin
  // guarda de nuevo el código de seguimiento sin cambiar el estado, no
  // hace falta reenviar la notificación.
  if (before.status !== status) {
    void sendOrderEmail({
      to: item.email,
      subject: "Actualización de tu pedido — Nails Palette",
      heading: "Novedades sobre tu pedido",
      bodyLines: [
        `¡Hola! El estado de tu pedido es ${STATUS_LABELS[status]}.`,
        'Recordá que podés ingresar a través de la página del "pedido" para ver el detalle y el estado.',
      ],
      ctaLabel: "Ver mi pedido",
      ctaUrl: `${getSiteUrl()}/pedido/${item.id}`,
    }).catch((err) => console.error("[admin/orders] mail de estado falló", err));
  }

  return NextResponse.json({ item });
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    await prisma.$transaction(async (tx) => {
      const order = await tx.order.findUniqueOrThrow({
        where: { id },
        select: { orderNumber: true },
      });
      await releaseOrderNumber(tx, order.orderNumber);
      await tx.order.delete({ where: { id } });
    });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "No se encontró el pedido." }, { status: 404 });
  }
}
