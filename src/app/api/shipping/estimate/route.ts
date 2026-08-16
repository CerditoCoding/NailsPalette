import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { parsePostalCodeNumber } from "@/lib/postalCode";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const postalCode = (body as { postalCode?: unknown } | null)?.postalCode;

  if (typeof postalCode !== "string" || !postalCode.trim()) {
    return NextResponse.json({ error: "Ingresá un código postal." }, { status: 400 });
  }

  const cp = parsePostalCodeNumber(postalCode);
  if (cp === null) {
    return NextResponse.json(
      { error: "No pudimos interpretar ese código postal." },
      { status: 400 }
    );
  }

  const zone = await prisma.shippingZone.findFirst({
    where: { cpFrom: { lte: cp }, cpTo: { gte: cp } },
    orderBy: { cpFrom: "asc" },
  });

  if (!zone) {
    return NextResponse.json(
      {
        error:
          "Todavía no tenemos un envío calculado para esa zona. Coordinalo por WhatsApp y te confirmamos el costo.",
      },
      { status: 404 }
    );
  }

  return NextResponse.json({ zoneName: zone.name, price: zone.price });
}
