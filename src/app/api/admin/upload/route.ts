import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { NextResponse } from "next/server";

const ALLOWED_TYPES = [
  "image/png",
  "image/jpeg",
  "image/webp",
  "image/gif",
] as const;

export async function POST(request: Request): Promise<NextResponse> {
  const body = (await request.json()) as HandleUploadBody;

  try {
    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async () => ({
        allowedContentTypes: [...ALLOWED_TYPES],
        addRandomSuffix: true,
        maximumSizeInBytes: 8 * 1024 * 1024, // 8MB
      }),
      onUploadCompleted: async () => {
        // No-op: la publicación se crea/edita recién cuando el admin
        // guarda el formulario, con la URL que devuelve esta subida.
      },
    });

    return NextResponse.json(jsonResponse);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "No se pudo subir la imagen." },
      { status: 400 }
    );
  }
}
