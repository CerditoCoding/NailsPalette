import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { AnnouncementBar } from "@/components/AnnouncementBar";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CartDrawer } from "@/components/CartDrawer";
import { FloatingActions } from "@/components/FloatingActions";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Mis Diseños",
  description:
    "Mirá una selección de diseños de uñas press on hechos a mano por Nails Palette. Elegí tu favorito y coordinalo por WhatsApp o Instagram.",
};

export default async function MisDisenosPage() {
  const photos = await prisma.designPhoto.findMany({ orderBy: { position: "asc" } });

  return (
    <div className="flex min-h-full flex-col bg-white">
      <AnnouncementBar />
      <Header />
      <main className="flex-1">
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="mb-6 inline-flex items-center gap-1 text-sm font-medium text-zinc-600 hover:text-pink-500"
          >
            ← Volver al inicio
          </Link>

          <h1 className="mb-2 text-2xl font-bold text-zinc-900">💅 Mis Diseños</h1>
          <p className="mb-8 text-sm text-zinc-600">
            Una selección de trabajos hechos a mano. Si te gusta alguno, escribinos por
            WhatsApp o Instagram y lo coordinamos.
          </p>

          {photos.length === 0 ? (
            <p className="py-16 text-center text-sm text-zinc-500">
              Todavía no cargamos diseños acá. ¡Volvé pronto!
            </p>
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
              {photos.map((photo) => (
                <div
                  key={photo.id}
                  className="relative aspect-square overflow-hidden rounded-xl bg-pink-50"
                >
                  <Image
                    src={photo.url}
                    alt=""
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
      <CartDrawer />
      <FloatingActions />
    </div>
  );
}
