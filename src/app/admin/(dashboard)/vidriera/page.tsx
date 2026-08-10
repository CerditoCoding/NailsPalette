import { prisma } from "@/lib/prisma";
import { ShowcaseManager } from "@/components/admin/ShowcaseManager";

export const dynamic = "force-dynamic";

export default async function AdminShowcasePage() {
  const photos = await prisma.showcasePhoto.findMany({ orderBy: { position: "asc" } });

  return (
    <div>
      <h1 className="mb-2 text-xl font-bold text-zinc-900">Vidriera</h1>
      <p className="mb-6 text-sm text-zinc-500">
        Subí hasta 6 fotos para el carrusel que se muestra en la página principal, entre el
        inicio y el catálogo.
      </p>
      <ShowcaseManager initialPhotos={photos} />
    </div>
  );
}
