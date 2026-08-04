import { NextResponse } from "next/server";
import {
  countProductsUsingTag,
  deleteTag,
  isTagType,
  TAG_TYPE_LABELS,
} from "@/lib/tagTypes";

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ type: string; id: string }> }
) {
  const { type, id } = await params;
  if (!isTagType(type)) {
    return NextResponse.json({ error: "Tipo de etiqueta inválido." }, { status: 400 });
  }

  const usageCount = await countProductsUsingTag(type, id);
  if (usageCount > 0 && type !== "sizes") {
    return NextResponse.json(
      {
        error: `No se puede eliminar: hay ${usageCount} publicación(es) usando esta ${TAG_TYPE_LABELS[type]}.`,
      },
      { status: 409 }
    );
  }

  try {
    await deleteTag(type, id);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "No se encontró la etiqueta." }, { status: 404 });
  }
}
