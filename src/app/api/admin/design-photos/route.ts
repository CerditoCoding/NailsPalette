import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const MAX_PHOTOS = 30;

export async function GET() {
  const items = await prisma.designPhoto.findMany({ orderBy: { position: "asc" } });
  return NextResponse.json({ items });
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const url = (body as { url?: unknown } | null)?.url;

  if (typeof url !== "string" || !url.trim()) {
    return NextResponse.json({ error: "Falta la imagen." }, { status: 400 });
  }

  const count = await prisma.designPhoto.count();
  if (count >= MAX_PHOTOS) {
    return NextResponse.json(
      { error: `Ya tenés el máximo de ${MAX_PHOTOS} fotos en Mis Diseños.` },
      { status: 409 }
    );
  }

  const item = await prisma.designPhoto.create({
    data: { url, position: count },
  });

  return NextResponse.json({ item }, { status: 201 });
}
