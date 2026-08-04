export type CatalogProduct = {
  id: string;
  slug: string;
  name: string;
  description: string;
  price: number;
  coverImage: string;
  images: string[];
  collection: string;
  shape: string;
  sizes: string[];
};
