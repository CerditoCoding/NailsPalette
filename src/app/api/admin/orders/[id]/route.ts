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
    | { status?: unknown; trackingCode?: unknown; trackingUrl?: unknown }
    | null;

  const status = body?.status;
  if (!isOrderStatus(status)) {
    return NextResponse.json({ error: "Estado inválido." }, { status: 400 });
  }

  const trackingCode = typeof body?.trackingCode === "string" ? body.trackingCode : undefined;
  const trackingUrl = typeof body?.trackingUrl === "string" ? body.trackingUrl : undefined;

  const before = await prisma.order.findUnique({ where: { id } });
  if (!before) {
    return NextResponse.json({ error: "No se encontró el pedido." }, { status: 404 });
  }

  const item = await prisma.order.update({
    where: { id },
    data: { status, trackingCode, trackingUrl },
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
