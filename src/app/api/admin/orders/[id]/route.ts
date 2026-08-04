import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const VALID_STATUSES = new Set(["nuevo", "contactado", "entregado", "cancelado"]);

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json().catch(() => null);
  const status = (body as { status?: unknown } | null)?.status;

  if (typeof status !== "string" || !VALID_STATUSES.has(status)) {
    return NextResponse.json({ error: "Estado inválido." }, { status: 400 });
  }

  try {
    const item = await prisma.order.update({ where: { id }, data: { status } });
    return NextResponse.json({ item });
  } catch {
    return NextResponse.json({ error: "No se encontró el pedido." }, { status: 404 });
  }
}
