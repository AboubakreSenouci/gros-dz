import { prisma } from "../prisma";

export async function getUser() {
  return await prisma.user.findMany();
}

export async function getBuyers() {
  return await prisma.user.findMany({
    where: {
      role: "buyer",
    },
  });
}
