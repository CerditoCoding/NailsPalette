-- CreateTable
CREATE TABLE "ShowcasePhoto" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "position" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ShowcasePhoto_pkey" PRIMARY KEY ("id")
);
