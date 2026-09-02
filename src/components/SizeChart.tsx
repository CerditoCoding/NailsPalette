const SIZE_ROWS = [
  { talle: "XS", pulgar: 14, indice: 10, mayor: 11, anular: 10, menique: 7 },
  { talle: "S", pulgar: 15, indice: 11, mayor: 12, anular: 11, menique: 8 },
  { talle: "M", pulgar: 16, indice: 12, mayor: 13, anular: 12, menique: 9 },
  { talle: "L", pulgar: 17, indice: 13, mayor: 14, anular: 13, menique: 10 },
] as const;

const COLUMNS: { key: keyof (typeof SIZE_ROWS)[number]; label: string }[] = [
  { key: "pulgar", label: "Pulgar" },
  { key: "indice", label: "Índice" },
  { key: "mayor", label: "Mayor" },
  { key: "anular", label: "Anular" },
  { key: "menique", label: "Meñique" },
];

/** Tabla de talles fija (medidas en mm por dedo) — es contenido de referencia,
 * igual para todo el catálogo, no depende de datos de la base. Se reutiliza
 * en la sección del Home y en el modal de cada publicación. */
export function SizeChart() {
  return (
    <div className="mx-auto max-w-2xl rounded-3xl bg-pink-100 p-5 sm:p-8">
      <h3 className="mb-6 text-center text-2xl font-extrabold text-pink-600 sm:text-3xl">
        📏 Tabla de talles
      </h3>

      <div className="overflow-x-auto rounded-2xl">
        <table className="w-full min-w-[480px] border-separate border-spacing-1 text-center text-sm">
          <thead>
            <tr>
              <th className="rounded-lg bg-pink-300 px-3 py-2 font-bold uppercase tracking-wide text-white">
                Talle
              </th>
              {COLUMNS.map((col) => (
                <th
                  key={col.key}
                  className="rounded-lg bg-pink-200 px-3 py-2 font-semibold uppercase tracking-wide text-pink-700"
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {SIZE_ROWS.map((row) => (
              <tr key={row.talle}>
                <td className="rounded-lg bg-pink-300 px-3 py-2 font-bold text-white">
                  {row.talle}
                </td>
                {COLUMNS.map((col) => (
                  <td key={col.key} className="rounded-lg bg-white px-3 py-2 font-medium text-zinc-700">
                    {row[col.key]}mm
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="mt-5 text-center text-xs font-medium text-pink-700 sm:text-sm">
        Si ningún talle coincide con tus medidas, después de comprar dejá tus medidas en cm en las
        notas opcionales de la web o pasámelas por WhatsApp.
      </p>
    </div>
  );
}
