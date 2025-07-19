import { UserRole } from "@/generated/prisma";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextApiRequest } from "next";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import * as z from "zod";

export const DeleteShortlistPayloadSchema = z.object({
  id: z
    .string()
    .uuid({ message: 'id must be a valid ID' }),
});
export async function DELETE(req: NextApiRequest) {
  try {

    const session = await auth.api.getSession({
      headers: await headers(),
    });
    if (!session) {
      return NextResponse.redirect('sigin');
    }

    const user = session.user;
    if (!user.role || user.role !== UserRole.BUYER) {
      return NextResponse.json(
        { error: 'User must be a buyer' },
        { status: 400 }
      );
    }
    const buyerId = user.id;

    const { data, success, error } = await DeleteShortlistPayloadSchema.safeParseAsync(req.query);
    if (!success) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      );
    }

    const { id } = data;

    const deleteShortlist = await prisma.shortlist.delete({ where: { id, company: { ownerId: buyerId } } });
    if (!deleteShortlist) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    return NextResponse.json(
      { id: deleteShortlist.id },
      { status: 200 }
    );
  } catch (_error) {
    return NextResponse.json(
      { error: 'Failed to add delete product from shortlist' },
      { status: 500 }
    );
  }
}
