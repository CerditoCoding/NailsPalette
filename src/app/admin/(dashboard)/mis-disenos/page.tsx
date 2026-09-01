import { prisma } from "@/lib/prisma";
import { DesignPhotoManager } from "@/components/admin/DesignPhotoManager";

export const dynamic = "force-dynamic";

export default async function AdminMisDisenosPage() {
  const photos = await prisma.designPhoto.findMany({ orderBy: { position: "asc" } });

  return (
    <div>
      <h1 className="mb-2 text-xl font-bold text-zinc-900">Mis Diseños</h1>
      <p className="mb-6 text-sm text-zinc-500">
        Subí las fotos que se muestran en la página pública &quot;Mis Diseños&quot; y en el
        preview del botón de la página principal.
      </p>
      <DesignPhotoManager initialPhotos={photos} />
    </div>
  );
}
