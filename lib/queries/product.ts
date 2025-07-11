import { prisma } from "../prisma";

export async function getAllProducts() {
  return prisma.product.findMany({
    include: { supplier: true },
  });
}

export async function getProductById(id: number) {
  return prisma.product.findUnique({
    where: { id },
    include: { supplier: true },
  });
}
