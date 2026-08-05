import { put } from "@vercel/blob";
import { NextResponse } from "next/server";

const ALLOWED_TYPES = new Set(["image/png", "image/jpeg", "image/webp", "image/gif"]);
const MAX_SIZE_BYTES = 4 * 1024 * 1024; // margen por debajo del límite de body de Vercel Functions

export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No se recibió ningún archivo." }, { status: 400 });
  }

  if (!ALLOWED_TYPES.has(file.type)) {
    return NextResponse.json(
      { error: "Formato de imagen no soportado (usá PNG, JPG, WEBP o GIF)." },
      { status: 400 }
    );
  }

  if (file.size > MAX_SIZE_BYTES) {
    return NextResponse.json(
      { error: "La imagen supera el tamaño máximo de 4MB." },
      { status: 400 }
    );
  }

  try {
    const blob = await put(file.name, file, {
      access: "public",
      addRandomSuffix: true,
    });
    return NextResponse.json({ url: blob.url }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "No se pudo subir la imagen." },
      { status: 500 }
    );
  }
}
