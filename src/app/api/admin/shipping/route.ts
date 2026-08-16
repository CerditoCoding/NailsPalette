import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const items = await prisma.shippingZone.findMany({ orderBy: { cpFrom: "asc" } });
  return NextResponse.json({ items });
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  if (typeof body !== "object" || body === null) {
    return NextResponse.json({ error: "Datos inválidos." }, { status: 400 });
  }
  const b = body as Record<string, unknown>;

  const name = typeof b.name === "string" ? b.name.trim() : "";
  const cpFrom = Number(b.cpFrom);
  const cpTo = Number(b.cpTo);
  const price = Number(b.price);

  if (!name) {
    return NextResponse.json({ error: "El nombre de la zona es obligatorio." }, { status: 400 });
  }
  if (!Number.isInteger(cpFrom) || !Number.isInteger(cpTo) || cpFrom < 0 || cpTo < 0) {
    return NextResponse.json({ error: "El rango de CP debe ser numérico." }, { status: 400 });
  }
  if (cpFrom > cpTo) {
    return NextResponse.json(
      { error: "El CP inicial no puede ser mayor al final." },
      { status: 400 }
    );
  }
  if (!Number.isFinite(price) || price < 0) {
    return NextResponse.json({ error: "El precio debe ser un número mayor o igual a 0." }, { status: 400 });
  }

  const item = await prisma.shippingZone.create({
    data: { name, cpFrom, cpTo, price: Math.round(price) },
  });

  return NextResponse.json({ item }, { status: 201 });
}
