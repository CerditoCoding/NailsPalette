const ITEMS = [
  {
    title: "Coordinamos por WhatsApp",
    description: "Elegí tus diseños y armamos el pedido por chat.",
    icon: "💬",
  },
  {
    title: "Hecho a mano con amor",
    description: "Mi emprendimiento es pequeño, pero vos lo hacés inmenso.",
    icon: "🏠",
  },
];

export function InfoStrip() {
  return (
    <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-4 py-8 sm:grid-cols-2 sm:px-6 lg:px-8">
      {ITEMS.map((item) => (
        <div key={item.title} className="flex items-center gap-4">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-pink-100 text-xl">
            {item.icon}
          </span>
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-zinc-900">
              {item.title}
            </p>
            <p className="text-sm text-zinc-500">{item.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
