"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { formatCurrency } from "@/lib/currency";

type Tag = { id: string; name: string };
type DesignTag = Tag & { priceModifier: number };

type InitialProduct = {
  id: string;
  name: string;
  description: string;
  price: number;
  collectionId: string;
  shapeId: string;
  designLevelId: string;
  sizeIds: string[];
  coverImage: string;
  images: string[];
};

async function uploadFile(file: File): Promise<string> {
  // Sube a través de nuestra propia función (mismo origen, sin CORS)
  // que en el servidor la guarda en Vercel Blob.
  const formData = new FormData();
  formData.append("file", file);
  const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error ?? "No se pudo subir la imagen.");
  return data.url as string;
}

function isEmojiPlaceholder(url: string) {
  return url.startsWith("emoji:");
}

function ImagePreview({ url }: { url: string }) {
  if (isEmojiPlaceholder(url)) {
    return (
      <div className="flex h-20 w-20 items-center justify-center rounded-lg bg-pink-100 text-2xl">
        {url.replace("emoji:", "")}
      </div>
    );
  }
  return (
    <Image
      src={url}
      alt=""
      width={80}
      height={80}
      className="h-20 w-20 rounded-lg object-cover"
    />
  );
}

export function ProductForm({
  tags,
  initialProduct,
}: {
  tags: { collections: Tag[]; shapes: Tag[]; sizes: Tag[]; designs: DesignTag[] };
  initialProduct?: InitialProduct;
}) {
  const router = useRouter();
  const isEditing = Boolean(initialProduct);

  const [name, setName] = useState(initialProduct?.name ?? "");
  const [description, setDescription] = useState(initialProduct?.description ?? "");
  const [price, setPrice] = useState(initialProduct?.price?.toString() ?? "");
  const [collectionId, setCollectionId] = useState(
    initialProduct?.collectionId ?? tags.collections[0]?.id ?? ""
  );
  const [shapeId, setShapeId] = useState(initialProduct?.shapeId ?? tags.shapes[0]?.id ?? "");
  const [designLevelId, setDesignLevelId] = useState(
    initialProduct?.designLevelId ?? tags.designs[0]?.id ?? ""
  );
  const [sizeIds, setSizeIds] = useState<string[]>(initialProduct?.sizeIds ?? []);
  const [coverImage, setCoverImage] = useState(initialProduct?.coverImage ?? "");
  const [images, setImages] = useState<string[]>(initialProduct?.images ?? []);

  const [uploadingCover, setUploadingCover] = useState(false);
  const [uploadingRefs, setUploadingRefs] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const toggleSize = (id: string) => {
    setSizeIds((prev) => (prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]));
  };

  const handleCoverChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingCover(true);
    setError(null);
    try {
      const url = await uploadFile(file);
      setCoverImage(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo subir la portada.");
    } finally {
      setUploadingCover(false);
      e.target.value = "";
    }
  };

  const handleRefsChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (files.length === 0) return;
    const remainingSlots = 4 - images.length;
    const filesToUpload = files.slice(0, remainingSlots);

    setUploadingRefs(true);
    setError(null);
    try {
      const urls = await Promise.all(filesToUpload.map(uploadFile));
      setImages((prev) => [...prev, ...urls]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudieron subir las imágenes.");
    } finally {
      setUploadingRefs(false);
      e.target.value = "";
    }
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!coverImage) {
      setError("Subí una imagen de portada.");
      return;
    }
    if (sizeIds.length === 0) {
      setError("Elegí al menos un talle disponible.");
      return;
    }

    setSubmitting(true);
    const payload = {
      name,
      description,
      price: Number(price),
      collectionId,
      shapeId,
      designLevelId,
      sizeIds,
      coverImage,
      images,
    };

    const url = isEditing
      ? `/api/admin/products/${initialProduct!.id}`
      : "/api/admin/products";
    const method = isEditing ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();

    if (!res.ok) {
      setError(data.error ?? "No se pudo guardar la publicación.");
      setSubmitting(false);
      return;
    }

    router.push("/admin/publicaciones");
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
      <div>
        <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-zinc-500">
          Título
        </label>
        <input
          type="text"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full rounded-lg border border-pink-200 px-3 py-2 text-sm text-zinc-900 focus:border-pink-400 focus:outline-none"
        />
      </div>

      <div>
        <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-zinc-500">
          Descripción
        </label>
        <textarea
          required
          rows={4}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full rounded-lg border border-pink-200 px-3 py-2 text-sm text-zinc-900 focus:border-pink-400 focus:outline-none"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-zinc-500">
            Precio ($)
          </label>
          <input
            type="number"
            min={1}
            required
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full rounded-lg border border-pink-200 px-3 py-2 text-sm text-zinc-900 focus:border-pink-400 focus:outline-none"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-zinc-500">
            Colección
          </label>
          <select
            required
            value={collectionId}
            onChange={(e) => setCollectionId(e.target.value)}
            className="w-full rounded-lg border border-pink-200 px-3 py-2 text-sm text-zinc-900 focus:border-pink-400 focus:outline-none"
          >
            {tags.collections.length === 0 && <option value="">Creá una colección primero</option>}
            {tags.collections.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-zinc-500">
            Forma
          </label>
          <select
            required
            value={shapeId}
            onChange={(e) => setShapeId(e.target.value)}
            className="w-full rounded-lg border border-pink-200 px-3 py-2 text-sm text-zinc-900 focus:border-pink-400 focus:outline-none"
          >
            {tags.shapes.length === 0 && <option value="">Creá una forma primero</option>}
            {tags.shapes.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-zinc-500">
            Nivel de diseño
          </label>
          <select
            required
            value={designLevelId}
            onChange={(e) => setDesignLevelId(e.target.value)}
            className="w-full rounded-lg border border-pink-200 px-3 py-2 text-sm text-zinc-900 focus:border-pink-400 focus:outline-none"
          >
            {tags.designs.length === 0 && <option value="">Creá un nivel de diseño primero</option>}
            {tags.designs.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name}
                {d.priceModifier > 0 ? ` (+${formatCurrency(d.priceModifier)})` : ""}
              </option>
            ))}
          </select>
        </div>
      </div>

      {(() => {
        const selectedDesign = tags.designs.find((d) => d.id === designLevelId);
        const basePrice = Number(price) || 0;
        if (!selectedDesign || selectedDesign.priceModifier <= 0 || basePrice <= 0) return null;
        return (
          <p className="-mt-2 text-xs text-zinc-500">
            Precio final con {selectedDesign.name.toLowerCase()}:{" "}
            <span className="font-semibold text-pink-500">
              {formatCurrency(basePrice + selectedDesign.priceModifier)}
            </span>
          </p>
        );
      })()}

      <div>
        <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-zinc-500">
          Talles disponibles
        </label>
        <div className="flex flex-wrap gap-3">
          {tags.sizes.length === 0 && (
            <p className="text-sm text-zinc-400">Creá al menos un talle primero.</p>
          )}
          {tags.sizes.map((size) => (
            <label
              key={size.id}
              className="flex items-center gap-2 rounded-lg border border-pink-200 px-3 py-1.5 text-sm text-zinc-700"
            >
              <input
                type="checkbox"
                checked={sizeIds.includes(size.id)}
                onChange={() => toggleSize(size.id)}
                className="h-4 w-4 rounded border-zinc-300 text-pink-500 focus:ring-pink-400"
              />
              {size.name}
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-zinc-500">
          Imagen de portada
        </label>
        <div className="flex items-center gap-4">
          {coverImage && <ImagePreview url={coverImage} />}
          <label className="cursor-pointer rounded-lg border border-dashed border-pink-300 px-4 py-2 text-sm text-pink-500 hover:bg-pink-50">
            {uploadingCover ? "Subiendo..." : coverImage ? "Cambiar imagen" : "Subir imagen"}
            <input type="file" accept="image/*" className="hidden" onChange={handleCoverChange} />
          </label>
        </div>
      </div>

      <div>
        <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-zinc-500">
          Imágenes de referencia (hasta 4)
        </label>
        <div className="flex flex-wrap items-center gap-3">
          {images.map((url, index) => (
            <div key={url + index} className="relative">
              <ImagePreview url={url} />
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-zinc-800 text-xs text-white"
                aria-label="Quitar imagen"
              >
                ×
              </button>
            </div>
          ))}
          {images.length < 4 && (
            <label className="cursor-pointer rounded-lg border border-dashed border-pink-300 px-4 py-2 text-sm text-pink-500 hover:bg-pink-50">
              {uploadingRefs ? "Subiendo..." : "Agregar imagen"}
              <input
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={handleRefsChange}
              />
            </label>
          )}
        </div>
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={submitting}
          className="rounded-full bg-pink-400 px-6 py-2.5 text-sm font-semibold uppercase tracking-wide text-white hover:bg-pink-500 disabled:opacity-60"
        >
          {submitting ? "Guardando..." : isEditing ? "Guardar cambios" : "Crear publicación"}
        </button>
      </div>
    </form>
  );
}
