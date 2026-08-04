import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { validateProductPayload } from "@/lib/productPayload";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const item = await prisma.product.findUnique({
    where: { id },
    include: { collection: true, shape: true, sizes: true, images: true },
  });
  if (!item) return NextResponse.json({ error: "No encontrado." }, { status: 404 });
  return NextResponse.json({ item });
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json().catch(() => null);
  const result = validateProductPayload(body);
  if ("error" in result) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }
  const { data } = result;

  const existing = await prisma.product.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: "No encontrado." }, { status: 404 });
  }

  await prisma.productImage.deleteMany({ where: { productId: id } });

  const item = await prisma.product.update({
    where: { id },
    data: {
      name: data.name,
      description: data.description,
      price: data.price,
      coverImage: data.coverImage,
      collectionId: data.collectionId,
      shapeId: data.shapeId,
      sizes: { set: data.sizeIds.map((sizeId) => ({ id: sizeId })) },
      images: { create: data.images.map((url, position) => ({ url, position })) },
    },
    include: { collection: true, shape: true, sizes: true, images: true },
  });

  return NextResponse.json({ item });
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    await prisma.product.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "No se encontró la publicación." }, { status: 404 });
  }
}
