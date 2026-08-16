import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { validateOrderPayload } from "@/lib/orderPayload";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const result = validateOrderPayload(body);
  if ("error" in result) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }
  const { data } = result;

  const itemsTotal = data.items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
  const total = itemsTotal + data.shippingEstimate;

  const order = await prisma.order.create({
    data: {
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

  return NextResponse.json({ item: order }, { status: 201 });
}
