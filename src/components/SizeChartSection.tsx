import { SizeChart } from "@/components/SizeChart";

export function SizeChartSection() {
  return (
    <section id="tabla-de-talles" className="bg-white py-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="mb-3 text-center text-2xl font-bold text-zinc-900">Tabla de talles</h2>
        <p className="mx-auto mb-8 max-w-xl text-center text-sm text-zinc-600">
          Medí el ancho de cada uña con una cinta métrica y compará con la tabla para elegir el
          talle que más se ajuste a tu mano.
        </p>
        <SizeChart />
      </div>
    </section>
  );
}
