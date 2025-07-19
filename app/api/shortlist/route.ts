
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { PaginationSchema } from '@/src/shared/schema-validation.helpers'
import type { NextApiRequest, NextApiResponse } from 'next'
import { headers } from 'next/headers'
import { NextResponse } from 'next/server'

export default async function GET(req: NextApiRequest, res: NextApiResponse) {
  try {

    const session = await auth.api.getSession({
      headers: await headers(),
    });
    if (!session) {
      return NextResponse.redirect('sigin');
    }

    const user = session.user;
    if (!user.role) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }

    const buyerId = user.buyerId;

    const parsedQueryParams = await PaginationSchema.safeParseAsync(req.query);
    if (!parsedQueryParams.success) {
      return NextResponse.json(
        { error: parsedQueryParams.error.errors[0].message },
        { status: 400 }
      );
    }
    const { page, pageSize } = parsedQueryParams.data;


    const shortlistProducts = await prisma.shortlist.findMany({
      where: {
        buyerId,
      },
      orderBy: [{
        createdAt: 'desc',
      }],
      include: {
        product: true,
      },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });

    return res.status(200).json(shortlistProducts);
  } catch (_error) {
    return res.status(400).json({ error: 'Bad request' })
  }
}
