import { buildWhatsappLink } from "@/lib/whatsapp";

export function Contact() {
  return (
    <section id="contacto" className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6 lg:px-8">
      <h2 className="mb-3 text-2xl font-bold text-zinc-900">¿Tenés dudas?</h2>
      <p className="mb-6 text-sm text-zinc-600">
        Escribinos por WhatsApp o Instagram y te ayudamos a elegir el diseño
        perfecto para vos.
      </p>
      <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
        <a
          href={buildWhatsappLink("¡Hola! Tengo una consulta sobre los press on.")}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-full bg-green-500 px-6 py-3 text-sm font-semibold uppercase tracking-wide text-white hover:bg-green-600"
        >
          WhatsApp
        </a>
        <a
          href="https://www.instagram.com/nails_palette_/"
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-full border border-pink-300 px-6 py-3 text-sm font-semibold uppercase tracking-wide text-pink-500 hover:border-pink-400"
        >
          Instagram
        </a>
      </div>
    </section>
  );
}
