import { prisma } from "../prisma";

export async function getSuppliers() {
  return await prisma.user.findMany({
    where: {
      role: "supplier",
    },
  });
}
