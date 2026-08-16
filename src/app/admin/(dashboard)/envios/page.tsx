import { prisma } from "@/lib/prisma";
import { ShippingZoneManager } from "@/components/admin/ShippingZoneManager";

export const dynamic = "force-dynamic";

export default async function AdminShippingPage() {
  const zones = await prisma.shippingZone.findMany({ orderBy: { cpFrom: "asc" } });

  return (
    <div>
      <h1 className="mb-2 text-xl font-bold text-zinc-900">Estimados de envío</h1>
      <p className="mb-6 text-sm text-zinc-500">
        Definí zonas por rango de código postal (formato numérico, ej. 1000 a 1499) y su precio.
        En el carrito, el cliente ingresa su CP y el sistema busca en qué zona cae.
      </p>
      <ShippingZoneManager initialZones={zones} />
    </div>
  );
}
