export default function AdminShippingPage() {
  return (
    <div>
      <h1 className="mb-2 text-xl font-bold text-zinc-900">Estimados de envío</h1>
      <p className="mb-6 text-sm text-zinc-500">
        Configurá tarifas de envío según el código postal del cliente.
      </p>
      <div className="rounded-2xl border border-dashed border-pink-200 bg-white px-6 py-12 text-center">
        <p className="text-3xl">🚚</p>
        <p className="mt-3 text-sm font-semibold text-zinc-700">Próximamente</p>
        <p className="mx-auto mt-1 max-w-sm text-sm text-zinc-500">
          Esta sección va a permitir cargar zonas y tarifas por código postal para calcular el
          envío automáticamente en el checkout. La vamos a construir en la próxima etapa.
        </p>
      </div>
    </div>
  );
}
