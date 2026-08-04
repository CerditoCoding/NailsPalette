const STEPS = [
  {
    number: "1",
    title: "Elegí tu diseño",
    description: "Explorá el catálogo y agregá los press on que te gusten.",
  },
  {
    number: "2",
    title: "Revisá tu pedido",
    description: "Ajustá cantidades en el carrito antes de confirmar.",
  },
  {
    number: "3",
    title: "Coordinamos por WhatsApp",
    description: "Enviamos tu pedido armado y coordinamos pago y envío.",
  },
];

export function HowToOrder() {
  return (
    <section id="como-pedir" className="bg-pink-50/60 py-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="mb-10 text-center text-2xl font-bold text-zinc-900">
          Cómo pedir
        </h2>
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
          {STEPS.map((step) => (
            <div key={step.number} className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-pink-400 text-lg font-bold text-white">
                {step.number}
              </div>
              <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-zinc-900">
                {step.title}
              </h3>
              <p className="text-sm text-zinc-600">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
