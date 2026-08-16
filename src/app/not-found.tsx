import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { FloatingWhatsapp } from "@/components/FloatingWhatsapp";

export default function NotFound() {
  return (
    <div className="flex min-h-full flex-col bg-white">
      <Header />
      <main className="flex flex-1 items-center justify-center px-4 py-20">
        <div className="mx-auto max-w-md text-center">
          <span className="text-6xl">💅</span>
          <p className="mt-4 text-sm font-semibold uppercase tracking-widest text-pink-400">
            Error 404
          </p>
          <h1 className="mt-2 text-2xl font-bold text-zinc-900 sm:text-3xl">
            Uy, esta página se despintó
          </h1>
          <p className="mt-3 text-sm text-zinc-500">
            No encontramos lo que estás buscando. Puede que el link esté vencido o que la
            publicación ya no exista.
          </p>
          <Link
            href="/"
            className="mt-8 inline-block rounded-full bg-pink-400 px-8 py-3 text-sm font-semibold uppercase tracking-wide text-white transition-colors hover:bg-pink-500"
          >
            Volver al catálogo
          </Link>
        </div>
      </main>
      <Footer />
      <FloatingWhatsapp />
    </div>
  );
}
