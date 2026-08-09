import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL_UNPOOLED ?? process.env.DATABASE_URL,
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const collections = ["Clásicos", "Glitter", "Francesa", "Temporada"];
const shapes = ["Almendra", "Coffin", "Cuadrada", "Stiletto"];
const sizes = ["S", "M", "L"];
const designs = ["Lisas", "Diseño sencillo", "Full diseño"];

const products = [
  {
    slug: "rosa-nude",
    name: "Rosa Nude",
    price: 6800,
    collection: "Clásicos",
    shape: "Almendra",
    design: "Lisas",
    sizes: ["S", "M", "L"],
    coverEmoji: "💅",
    description:
      "Un clásico nude rosado, ideal para el día a día. Cubre toda la uña con un acabado suave y natural.",
  },
  {
    slug: "french-classic",
    name: "Francesa Clásica",
    price: 7200,
    collection: "Francesa",
    shape: "Coffin",
    design: "Diseño sencillo",
    sizes: ["M", "L"],
    coverEmoji: "🤍",
    description: "La francesa de siempre, con punta blanca prolija sobre base rosada.",
  },
  {
    slug: "glitter-gold",
    name: "Glitter Dorado",
    price: 8500,
    collection: "Glitter",
    shape: "Stiletto",
    design: "Full diseño",
    sizes: ["M", "L"],
    coverEmoji: "✨",
    description: "Brillo dorado intenso para ocasiones especiales.",
  },
  {
    slug: "red-passion",
    name: "Rojo Pasión",
    price: 7200,
    collection: "Clásicos",
    shape: "Cuadrada",
    design: "Lisas",
    sizes: ["S", "M", "L"],
    coverEmoji: "❤️",
    description: "Un rojo intenso y clásico que nunca falla.",
  },
  {
    slug: "french-pink",
    name: "Francesa Rosa",
    price: 7500,
    collection: "Francesa",
    shape: "Almendra",
    design: "Diseño sencillo",
    sizes: ["S", "M"],
    coverEmoji: "🌸",
    description: "Variante de la francesa clásica con punta rosada suave.",
  },
  {
    slug: "glitter-silver",
    name: "Glitter Plateado",
    price: 8500,
    collection: "Glitter",
    shape: "Coffin",
    design: "Full diseño",
    sizes: ["M", "L"],
    coverEmoji: "✨",
    description: "Brillo plateado para un look elegante y luminoso.",
  },
  {
    slug: "primavera-flores",
    name: "Flores de Primavera",
    price: 7900,
    collection: "Temporada",
    shape: "Almendra",
    design: "Full diseño",
    sizes: ["S", "M", "L"],
    coverEmoji: "🌷",
    description: "Diseño floral delicado inspirado en la primavera.",
  },
  {
    slug: "verano-tropical",
    name: "Tropical de Verano",
    price: 7900,
    collection: "Temporada",
    shape: "Cuadrada",
    design: "Diseño sencillo",
    sizes: ["S", "M"],
    coverEmoji: "🌺",
    description: "Colores vibrantes con inspiración tropical para el verano.",
  },
  {
    slug: "nude-mate",
    name: "Nude Mate",
    price: 6800,
    collection: "Clásicos",
    shape: "Coffin",
    design: "Lisas",
    sizes: ["M", "L"],
    coverEmoji: "🤎",
    description: "Nude mate elegante, perfecto para cualquier ocasión.",
  },
];

async function main() {
  const collectionRecords = new Map<string, string>();
  for (const name of collections) {
    const record = await prisma.collection.upsert({
      where: { name },
      update: {},
      create: { name },
    });
    collectionRecords.set(name, record.id);
  }

  const shapeRecords = new Map<string, string>();
  for (const name of shapes) {
    const record = await prisma.shape.upsert({
      where: { name },
      update: {},
      create: { name },
    });
    shapeRecords.set(name, record.id);
  }

  const sizeRecords = new Map<string, string>();
  for (const name of sizes) {
    const record = await prisma.size.upsert({
      where: { name },
      update: {},
      create: { name },
    });
    sizeRecords.set(name, record.id);
  }

  const designRecords = new Map<string, string>();
  for (const name of designs) {
    const record = await prisma.designLevel.upsert({
      where: { name },
      update: {},
      create: { name },
    });
    designRecords.set(name, record.id);
  }

  for (const product of products) {
    await prisma.product.upsert({
      where: { slug: product.slug },
      update: {},
      create: {
        slug: product.slug,
        name: product.name,
        description: product.description,
        price: product.price,
        coverImage: `emoji:${product.coverEmoji}`,
        collectionId: collectionRecords.get(product.collection)!,
        shapeId: shapeRecords.get(product.shape)!,
        designLevelId: designRecords.get(product.design)!,
        sizes: {
          connect: product.sizes.map((s) => ({ id: sizeRecords.get(s)! })),
        },
      },
    });
  }

  console.log(`Seed completo: ${products.length} productos.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
