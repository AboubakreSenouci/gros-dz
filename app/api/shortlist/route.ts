import { UserRole } from '@/generated/prisma'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { PaginationSchema } from '@/src/shared/schema-validation.helpers'
import type { NextApiRequest, NextApiResponse } from 'next'
import { headers } from 'next/headers'
import { NextResponse } from 'next/server'
import * as z from 'zod'

export async function GET(req: NextApiRequest) {
  try {

    const session = await auth.api.getSession({
      headers: await headers(),
    });
    if (!session) {
      return NextResponse.redirect('sigin');
    }

    const user = session.user;
    if (!user.role || user.role !== UserRole.BUYER) {
      return NextResponse.json({ error: 'User must be a buyer' }, { status: 401 });
    }
    const buyerId = user.id;
    const parsedQueryParams = await PaginationSchema.safeParseAsync(req.query);
    if (!parsedQueryParams.success) {
      return NextResponse.json(
        { error: parsedQueryParams.error.errors[0].message },
        { status: 400 }
      );
    }
    const page = parsedQueryParams?.data?.page || 11;
    const pageSize = parsedQueryParams?.data?.pageSize || 10;


    const shortlistProducts = await prisma.shortlist.findMany({
      where: {
        OR: [
          {
            company: {
              ownerId: buyerId,
            }
          },
          {
            company: {
              users: {
                some: {
                  id: buyerId,
                }
              },
            }
          }
        ],
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

    return NextResponse.json(
      shortlistProducts,
      { status: 200 }
    );
  } catch (_error) {
    return NextResponse.json(
      { error: 'Failed to fetch shortlist products' },
      { status: 500 }
    );
  }
}


export const AddToShortlistPayloadSchema = z.object({
  companyId: z
    .string()
    .uuid({ message: 'companyId must be a valid ID' }),
  productId: z
    .string()
    .uuid({ message: 'productId must be a valid ID' }),
});

export async function POST(req: NextApiRequest, res: NextApiResponse) {
  try {

    const session = await auth.api.getSession({
      headers: await headers(),
    });
    if (!session) {
      return NextResponse.redirect('sigin');
    }

    const user = session.user;
    if (!user.role || user.role !== UserRole.BUYER) {
      return NextResponse.json({ error: 'User must be a buyer' }, { status: 401 });
    }
    const buyerId = user.id;

    const { data, success, error } = await AddToShortlistPayloadSchema.safeParseAsync(req.body);
    if (!success) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      );
    }

    const { companyId, productId } = data;

    const company = await prisma.company.findUnique({ where: { id: companyId, ownerId: buyerId } });
    if (!company) {
      return res.status(404).json({ error: 'Company not found' });
    }

    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const existing = await prisma.shortlist.create({
      data: { companyId, productId },
    });
    if (existing) {
      return res.status(409).json({ error: 'This product is already in the shortlist' });
    }

    const created = await prisma.shortlist.create({
      data: { companyId, productId },
      include: { product: true },
    });

    return NextResponse.json(
      { id: created.id },
      { status: 200 }
    );
  } catch (_error) {
    return NextResponse.json(
      { error: 'Failed to add product to shortlist ' },
      { status: 500 }
    );
  }
}
