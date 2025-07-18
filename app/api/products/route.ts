import { Prisma } from "@/generated/prisma";
import { prisma } from "@/lib/prisma";
import { NextResponse, type NextRequest } from "next/server";
import * as z from 'zod';


const SortSchema = z
  .object({
    type: z.enum(['created_at', 'price', 'name', 'category']),
    direction: z.enum(['asc', 'desc']),
  })
  .optional()
  .default({ type: 'created_at', direction: 'desc' });


// Filters schema for JSON filters object
const FiltersSchema = z.object({
  category: z.string().optional(),
  price: z
    .object({
      from: z.number().nonnegative(),
      to: z.number().nonnegative(),
    })
    .optional(),
  search: z.string().optional(),
});

const QuerySchema = z.object({
  page: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : 1))
    .refine((val) => val > 0, { message: 'page must be positive' }),

  pageSize: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : 10))
    .refine((val) => val > 0 && val <= 100, {
      message: 'pageSize must be between 1 and 100',
    }),

  sort: SortSchema,
  filters: FiltersSchema,
});

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const rawQuery = {
    page: searchParams.get('page') ?? undefined,
    pageSize: searchParams.get('pageSize') ?? undefined,
    filters: searchParams.get('filters') ?? undefined,
    sort: searchParams.get('sort') ?? undefined,
  };

  const parsedQuery = await QuerySchema.safeParseAsync(request.nextUrl.searchParams);
  if (!parsedQuery.success) {
    console.error('Error at /api/products/route.ts: ', parsedQuery.error);
    return NextResponse.json(
      { error: parsedQuery.error.errors[0].message },
      { status: 400 }
    );
  }

  const { page, pageSize, filters = {}, sort } = parsedQuery.data;

  const skip = (page - 1) * pageSize;
  const take = pageSize;
  const where: Prisma.ProductWhereInput = {};

  if (filters.category) {
    where.category = filters.category;
  }

  if (filters.price) {
    // @ts-ignore
    where.price.gte = filters.price.from;
    // @ts-ignore
    where.price.lte = filters.price.to;
  }

  if (filters.search) {
    where.name = {
      contains: filters.search,
      mode: 'insensitive',
    };
  }

  const products = await prisma.product.findMany({
    where,
    skip,
    take,
    include: {
      supplier: {
        select: {
          companyName: true,
          id: true,
          logoUrl: true,
        }
      }
    }
  });
  return Response.json(products || []);
}

export async function GETProductById(request: Request) {
  const url = new URL(request.url);
  const id = parseInt(url.searchParams.get("id") || "0", 10);

  if (isNaN(id)) {
    return Response.json({ error: "Invalid product ID" }, { status: 400 });
  }

  const product = await getProductById(id);

  if (!product) {
    return Response.json({ error: "Product not found" }, { status: 404 });
  }

  return Response.json(product);
}
