import { prisma } from "@/lib/prisma";

const DIACRITICS_REGEX = /[̀-ͯ]/g;

export function slugify(input: string) {
  return input
    .normalize("NFD")
    .replace(DIACRITICS_REGEX, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export async function uniqueProductSlug(name: string, excludeId?: string) {
  const base = slugify(name) || "producto";
  let candidate = base;
  let suffix = 2;

  while (true) {
    const existing = await prisma.product.findUnique({ where: { slug: candidate } });
    if (!existing || existing.id === excludeId) {
      return candidate;
    }
    candidate = `${base}-${suffix}`;
    suffix += 1;
  }
}
