import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { uniqueProductSlug } from "@/lib/slug";
import { validateProductPayload } from "@/lib/productPayload";

export async function GET() {
  const items = await prisma.product.findMany({
    include: { collection: true, shape: true, designLevel: true, sizes: true, images: true },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json({ items });
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const result = validateProductPayload(body);
  if ("error" in result) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }
  const { data } = result;

  const slug = await uniqueProductSlug(data.name);

  const product = await prisma.product.create({
    data: {
      slug,
      name: data.name,
      description: data.description,
      price: data.price,
      coverImage: data.coverImage,
      collectionId: data.collectionId,
      shapeId: data.shapeId,
      designLevelId: data.designLevelId,
      sizes: { connect: data.sizeIds.map((id) => ({ id })) },
      images: { create: data.images.map((url, position) => ({ url, position })) },
    },
    include: { collection: true, shape: true, designLevel: true, sizes: true, images: true },
  });

  return NextResponse.json({ item: product }, { status: 201 });
}
