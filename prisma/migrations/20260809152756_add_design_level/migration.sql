-- CreateTable
CREATE TABLE "DesignLevel" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DesignLevel_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "DesignLevel_name_key" ON "DesignLevel"("name");

-- AlterTable
ALTER TABLE "Product" ADD COLUMN "designLevelId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_designLevelId_fkey" FOREIGN KEY ("designLevelId") REFERENCES "DesignLevel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
