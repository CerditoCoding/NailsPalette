/** Subconjunto del cliente de Prisma que necesitamos dentro de una
 * transacción — lo tipamos así (en vez de PrismaClient completo) para que
 * funcione tanto con `tx` como con el cliente normal en los tests. */
type OrderNumberTx = {
  freedOrderNumber: {
    findFirst: (args: { orderBy: { number: "asc" } }) => Promise<{ id: string; number: number } | null>;
    delete: (args: { where: { id: string } }) => Promise<unknown>;
    create: (args: { data: { number: number } }) => Promise<unknown>;
  };
  order: {
    aggregate: (args: { _max: { orderNumber: true } }) => Promise<{ _max: { orderNumber: number | null } }>;
  };
};

/** Busca el número liberado más bajo disponible; si no hay ninguno, sigue
 * la secuencia (max existente + 1, o 0 si todavía no hay pedidos). */
export async function allocateOrderNumber(tx: OrderNumberTx): Promise<number> {
  const freed = await tx.freedOrderNumber.findFirst({ orderBy: { number: "asc" } });
  if (freed) {
    await tx.freedOrderNumber.delete({ where: { id: freed.id } });
    return freed.number;
  }

  const agg = await tx.order.aggregate({ _max: { orderNumber: true } });
  return (agg._max.orderNumber ?? -1) + 1;
}

export async function releaseOrderNumber(tx: OrderNumberTx, number: number): Promise<void> {
  await tx.freedOrderNumber.create({ data: { number } });
}

/** true si el error es justo la colisión de "orderNumber" duplicado
 * (dos altas concurrentes agarraron el mismo número) — el único caso en el
 * que vale la pena reintentar la transacción completa una vez más. */
export function isOrderNumberCollision(err: unknown): boolean {
  if (typeof err !== "object" || err === null) return false;
  const e = err as { code?: unknown; meta?: { target?: unknown } };
  if (e.code !== "P2002") return false;
  const target = e.meta?.target;
  return Array.isArray(target) && target.includes("orderNumber");
}
