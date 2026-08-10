export async function uploadImage(file: File): Promise<string> {
  // Sube a través de nuestra propia función (mismo origen, sin CORS)
  // que en el servidor la guarda en Vercel Blob.
  const formData = new FormData();
  formData.append("file", file);
  const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error ?? "No se pudo subir la imagen.");
  return data.url as string;
}
