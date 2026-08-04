export function Hero() {
  return (
    <section
      id="inicio"
      className="bg-gradient-to-br from-pink-50 via-white to-pink-100"
    >
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-6 px-4 py-16 text-center sm:px-6 lg:px-8">
        <span className="rounded-full bg-pink-100 px-4 py-1 text-xs font-semibold uppercase tracking-wide text-pink-600">
          Press On Nails hechas a mano
        </span>
        <h1 className="max-w-2xl text-3xl font-bold tracking-tight text-zinc-900 sm:text-5xl">
          Uñas press on para cada ocasión
        </h1>
        <p className="max-w-xl text-base text-zinc-600 sm:text-lg">
          Elegí tu diseño favorito del catálogo y coordinamos tu pedido por
          WhatsApp. Reutilizables, fáciles de aplicar y hechas con amor.
        </p>
        <div className="flex flex-col gap-3 sm:flex-row">
          <a
            href="#catalogo"
            className="rounded-full bg-pink-400 px-6 py-3 text-sm font-semibold uppercase tracking-wide text-white hover:bg-pink-500"
          >
            Ver catálogo
          </a>
          <a
            href="#como-pedir"
            className="rounded-full border border-pink-300 px-6 py-3 text-sm font-semibold uppercase tracking-wide text-pink-500 hover:border-pink-400"
          >
            Cómo pedir
          </a>
        </div>
      </div>
    </section>
  );
}
