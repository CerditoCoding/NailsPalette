-- AlterTable: columnas nuevas en Order
ALTER TABLE "Order" ADD COLUMN "orderNumber" INTEGER;
ALTER TABLE "Order" ADD COLUMN "trackingCode" TEXT;
ALTER TABLE "Order" ADD COLUMN "trackingUrl" TEXT;

-- Backfill: numerar los pedidos existentes por orden de creación, desde 0
WITH numbered AS (
    SELECT "id", ROW_NUMBER() OVER (ORDER BY "createdAt" ASC, "id" ASC) - 1 AS rn
    FROM "Order"
)
UPDATE "Order" o SET "orderNumber" = numbered.rn
FROM numbered WHERE numbered."id" = o."id";

-- Recién con todas las filas numeradas se puede exigir NOT NULL + único
ALTER TABLE "Order" ALTER COLUMN "orderNumber" SET NOT NULL;
CREATE UNIQUE INDEX "Order_orderNumber_key" ON "Order"("orderNumber");

-- Migrar el vocabulario viejo de estados a los nuevos valores
UPDATE "Order" SET "status" = 'NUEVO'      WHERE "status" = 'nuevo';
UPDATE "Order" SET "status" = 'EN_PROCESO' WHERE "status" = 'contactado';
UPDATE "Order" SET "status" = 'RECIBIDO'   WHERE "status" = 'entregado';
UPDATE "Order" SET "status" = 'CERRADO'    WHERE "status" = 'cancelado';

-- AlterTable: nuevo default para "status"
ALTER TABLE "Order" ALTER COLUMN "status" SET DEFAULT 'NUEVO';

-- CreateIndex
CREATE INDEX "Order_status_idx" ON "Order"("status");

-- CreateTable
CREATE TABLE "FreedOrderNumber" (
    "id" TEXT NOT NULL,
    "number" INTEGER NOT NULL,
    "freedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FreedOrderNumber_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "FreedOrderNumber_number_key" ON "FreedOrderNumber"("number");
