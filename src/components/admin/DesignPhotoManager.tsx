"use client";

import { useState } from "react";
import Image from "next/image";
import { uploadImage } from "@/lib/uploadImage";

const MAX_PHOTOS = 30;

type Photo = { id: string; url: string };

export function DesignPhotoManager({ initialPhotos }: { initialPhotos: Photo[] }) {
  const [photos, setPhotos] = useState(initialPhotos);
  const [uploading, setUploading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError(null);

    try {
      const url = await uploadImage(file);
      const res = await fetch("/api/admin/design-photos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "No se pudo guardar la foto.");
      setPhotos((prev) => [...prev, data.item]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo subir la foto.");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    setError(null);

    const res = await fetch(`/api/admin/design-photos/${id}`, { method: "DELETE" });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "No se pudo eliminar la foto.");
      setDeletingId(null);
      return;
    }

    setPhotos((prev) => prev.filter((p) => p.id !== id));
    setDeletingId(null);
  };

  return (
    <div>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {photos.map((photo) => (
          <div
            key={photo.id}
            className="relative aspect-square overflow-hidden rounded-xl border border-pink-100"
          >
            <Image src={photo.url} alt="" fill sizes="25vw" className="object-cover" />
            <button
              type="button"
              onClick={() => handleDelete(photo.id)}
              disabled={deletingId === photo.id}
              className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-black/60 text-sm text-white hover:bg-black/80 disabled:opacity-50"
              aria-label="Quitar foto"
            >
              {deletingId === photo.id ? "…" : "×"}
            </button>
          </div>
        ))}

        {photos.length < MAX_PHOTOS && (
          <label className="flex aspect-square cursor-pointer flex-col items-center justify-center gap-1 rounded-xl border border-dashed border-pink-300 text-center text-sm text-pink-500 hover:bg-pink-50">
            <span>{uploading ? "Subiendo..." : "+ Agregar foto"}</span>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleUpload}
              disabled={uploading}
            />
          </label>
        )}
      </div>

      <p className="mt-3 text-xs text-zinc-400">{photos.length}/{MAX_PHOTOS} fotos</p>
      {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
    </div>
  );
}
