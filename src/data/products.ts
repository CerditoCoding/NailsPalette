export type Product = {
  id: string;
  name: string;
  price: number;
  collection: "Clásicos" | "Glitter" | "Francesa" | "Temporada";
  shape: "Almendra" | "Coffin" | "Cuadrada" | "Stiletto";
  size: "S" | "M" | "L";
  gradient: string;
  emoji: string;
};

export const products: Product[] = [
  {
    id: "rosa-nude",
    name: "Rosa Nude",
    price: 6800,
    collection: "Clásicos",
    shape: "Almendra",
    size: "M",
    gradient: "from-rose-200 via-rose-300 to-pink-400",
    emoji: "💅",
  },
  {
    id: "french-classic",
    name: "Francesa Clásica",
    price: 7200,
    collection: "Francesa",
    shape: "Coffin",
    size: "M",
    gradient: "from-white via-pink-100 to-pink-300",
    emoji: "🤍",
  },
  {
    id: "glitter-gold",
    name: "Glitter Dorado",
    price: 8500,
    collection: "Glitter",
    shape: "Stiletto",
    size: "L",
    gradient: "from-amber-200 via-yellow-300 to-pink-300",
    emoji: "✨",
  },
  {
    id: "red-passion",
    name: "Rojo Pasión",
    price: 7200,
    collection: "Clásicos",
    shape: "Cuadrada",
    size: "M",
    gradient: "from-rose-400 via-red-400 to-red-500",
    emoji: "❤️",
  },
  {
    id: "french-pink",
    name: "Francesa Rosa",
    price: 7500,
    collection: "Francesa",
    shape: "Almendra",
    size: "S",
    gradient: "from-pink-100 via-pink-200 to-fuchsia-300",
    emoji: "🌸",
  },
  {
    id: "glitter-silver",
    name: "Glitter Plateado",
    price: 8500,
    collection: "Glitter",
    shape: "Coffin",
    size: "L",
    gradient: "from-slate-200 via-slate-300 to-pink-200",
    emoji: "✨",
  },
  {
    id: "primavera-flores",
    name: "Flores de Primavera",
    price: 7900,
    collection: "Temporada",
    shape: "Almendra",
    size: "M",
    gradient: "from-lime-200 via-pink-200 to-rose-300",
    emoji: "🌷",
  },
  {
    id: "verano-tropical",
    name: "Tropical de Verano",
    price: 7900,
    collection: "Temporada",
    shape: "Cuadrada",
    size: "S",
    gradient: "from-orange-200 via-pink-300 to-fuchsia-400",
    emoji: "🌺",
  },
  {
    id: "nude-mate",
    name: "Nude Mate",
    price: 6800,
    collection: "Clásicos",
    shape: "Coffin",
    size: "L",
    gradient: "from-stone-200 via-rose-200 to-pink-300",
    emoji: "🤎",
  },
];

export const collections = ["Todas", "Clásicos", "Glitter", "Francesa", "Temporada"] as const;
export const shapes = ["Almendra", "Coffin", "Cuadrada", "Stiletto"] as const;
export const sizes = ["S", "M", "L"] as const;
