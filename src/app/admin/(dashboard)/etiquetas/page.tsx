import { prisma } from "@/lib/prisma";
import { TagManager } from "@/components/admin/TagManager";

export const dynamic = "force-dynamic";

export default async function AdminTagsPage() {
  const [collections, shapes, sizes, designs] = await Promise.all([
    prisma.collection.findMany({ orderBy: { name: "asc" } }),
    prisma.shape.findMany({ orderBy: { name: "asc" } }),
    prisma.size.findMany({ orderBy: { name: "asc" } }),
    prisma.designLevel.findMany({ orderBy: { name: "asc" } }),
  ]);

  return (
    <div>
      <h1 className="mb-2 text-xl font-bold text-zinc-900">Etiquetas</h1>
      <p className="mb-6 text-sm text-zinc-500">
        Administrá las colecciones, formas, talles y niveles de diseño disponibles para tus
        publicaciones.
      </p>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <TagManager
          type="collections"
          label="Colecciones"
          placeholder="Nueva colección"
          initialItems={collections}
        />
        <TagManager type="shapes" label="Formas" placeholder="Nueva forma" initialItems={shapes} />
        <TagManager type="sizes" label="Talles" placeholder="Nuevo talle" initialItems={sizes} />
        <TagManager
          type="designs"
          label="Nivel de diseño"
          placeholder="Nuevo nivel de diseño"
          initialItems={designs}
        />
      </div>
    </div>
  );
}
