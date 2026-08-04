export type ProductPayload = {
  name: string;
  description: string;
  price: number;
  collectionId: string;
  shapeId: string;
  sizeIds: string[];
  coverImage: string;
  images: string[];
};

export function validateProductPayload(
  body: unknown
): { data: ProductPayload } | { error: string } {
  if (typeof body !== "object" || body === null) {
    return { error: "Datos inválidos." };
  }
  const b = body as Record<string, unknown>;

  if (typeof b.name !== "string" || !b.name.trim()) {
    return { error: "El título es obligatorio." };
  }
  if (typeof b.description !== "string" || !b.description.trim()) {
    return { error: "La descripción es obligatoria." };
  }
  const price = Number(b.price);
  if (!Number.isFinite(price) || price <= 0) {
    return { error: "El precio debe ser un número mayor a 0." };
  }
  if (typeof b.collectionId !== "string" || !b.collectionId) {
    return { error: "Elegí una colección." };
  }
  if (typeof b.shapeId !== "string" || !b.shapeId) {
    return { error: "Elegí una forma." };
  }
  if (!Array.isArray(b.sizeIds) || b.sizeIds.length === 0) {
    return { error: "Elegí al menos un talle disponible." };
  }
  if (typeof b.coverImage !== "string" || !b.coverImage) {
    return { error: "Subí una imagen de portada." };
  }
  const images = Array.isArray(b.images)
    ? b.images.filter((i): i is string => typeof i === "string")
    : [];
  if (images.length > 4) {
    return { error: "Máximo 4 imágenes de referencia." };
  }

  return {
    data: {
      name: b.name.trim(),
      description: b.description.trim(),
      price: Math.round(price),
      collectionId: b.collectionId,
      shapeId: b.shapeId,
      sizeIds: b.sizeIds as string[],
      coverImage: b.coverImage,
      images,
    },
  };
}
