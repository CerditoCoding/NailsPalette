import { prisma } from "@/lib/prisma";

export const TAG_TYPES = ["collections", "shapes", "sizes"] as const;
export type TagType = (typeof TAG_TYPES)[number];

export function isTagType(value: string): value is TagType {
  return (TAG_TYPES as readonly string[]).includes(value);
}

export async function findAllTags(type: TagType) {
  switch (type) {
    case "collections":
      return prisma.collection.findMany({ orderBy: { name: "asc" } });
    case "shapes":
      return prisma.shape.findMany({ orderBy: { name: "asc" } });
    case "sizes":
      return prisma.size.findMany({ orderBy: { name: "asc" } });
  }
}

export async function createTag(type: TagType, name: string) {
  switch (type) {
    case "collections":
      return prisma.collection.create({ data: { name } });
    case "shapes":
      return prisma.shape.create({ data: { name } });
    case "sizes":
      return prisma.size.create({ data: { name } });
  }
}

export async function deleteTag(type: TagType, id: string) {
  switch (type) {
    case "collections":
      return prisma.collection.delete({ where: { id } });
    case "shapes":
      return prisma.shape.delete({ where: { id } });
    case "sizes":
      return prisma.size.delete({ where: { id } });
  }
}

export async function countProductsUsingTag(type: TagType, id: string) {
  if (type === "collections") {
    return prisma.product.count({ where: { collectionId: id } });
  }
  if (type === "shapes") {
    return prisma.product.count({ where: { shapeId: id } });
  }
  return prisma.product.count({ where: { sizes: { some: { id } } } });
}

export const TAG_TYPE_LABELS: Record<TagType, string> = {
  collections: "colección",
  shapes: "forma",
  sizes: "talle",
};
