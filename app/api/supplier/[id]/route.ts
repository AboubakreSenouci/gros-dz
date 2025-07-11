import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const supplierId = parseInt(params.id, 10);

  if (isNaN(supplierId)) {
    return Response.json({ error: "Invalid supplier ID" }, { status: 400 });
  }

  const supplier = await prisma.user.findUnique({
    where: { id: supplierId },
    include: {
      products: true,
    },
  });

  if (!supplier) {
    return Response.json({ error: "Supplier not found" }, { status: 404 });
  }

  return Response.json(supplier);
}
