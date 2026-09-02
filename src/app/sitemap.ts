import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";
import { SITE_URL } from "@/lib/site";

// Igual que el resto de las rutas que consultan la base: dinámico para no
// romper el build cuando no hay DATABASE_URL disponible (ver next.config.ts /
// otras páginas con `force-dynamic`).
export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const products = await prisma.product.findMany({
    where: { active: true },
    select: { slug: true, updatedAt: true },
  });

  return [
    {
      url: SITE_URL,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${SITE_URL}/mis-disenos`,
      changeFrequency: "weekly",
      priority: 0.6,
    },
    ...products.map((product) => ({
      url: `${SITE_URL}/producto/${product.slug}`,
      lastModified: product.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
  ];
}
