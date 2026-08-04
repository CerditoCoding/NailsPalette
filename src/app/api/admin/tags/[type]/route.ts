import { NextResponse } from "next/server";
import { createTag, findAllTags, isTagType, TAG_TYPE_LABELS } from "@/lib/tagTypes";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ type: string }> }
) {
  const { type } = await params;
  if (!isTagType(type)) {
    return NextResponse.json({ error: "Tipo de etiqueta inválido." }, { status: 400 });
  }

  const items = await findAllTags(type);
  return NextResponse.json({ items });
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ type: string }> }
) {
  const { type } = await params;
  if (!isTagType(type)) {
    return NextResponse.json({ error: "Tipo de etiqueta inválido." }, { status: 400 });
  }

  let name: unknown;
  try {
    ({ name } = await request.json());
  } catch {
    return NextResponse.json({ error: "Solicitud inválida." }, { status: 400 });
  }

  if (typeof name !== "string" || name.trim().length === 0) {
    return NextResponse.json({ error: "El nombre es obligatorio." }, { status: 400 });
  }

  try {
    const item = await createTag(type, name.trim());
    return NextResponse.json({ item }, { status: 201 });
  } catch (error: unknown) {
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      (error as { code?: string }).code === "P2002"
    ) {
      return NextResponse.json(
        { error: `Ya existe una ${TAG_TYPE_LABELS[type]} con ese nombre.` },
        { status: 409 }
      );
    }
    throw error;
  }
}
