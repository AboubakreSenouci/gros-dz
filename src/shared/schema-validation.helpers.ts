import { NextResponse } from 'next/server';
import { z } from 'zod'


export const PaginationSchema = z.object({
  page: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : 1))
    .refine((val) => val > 0, { message: 'Page must be positive' }),

  pageSize: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : 10))
    .refine((val) => val > 0 && val <= 100, {
      message: 'PageSize must be between 1 and 100',
    }),
}).optional();

export type PaginationParams = z.infer<typeof PaginationSchema>

export async function parseSearchParams<T extends z.ZodTypeAny>(
  schema: T,
  params: URLSearchParams
): Promise<z.infer<T>> {
  const raw: Record<string, string | undefined> = {}
  for (const [key, value] of params.entries()) {
    raw[key] = value
  }

  const parsedData = await schema.safeParseAsync(raw);

  if(!parsedData.success) {
    return NextResponse.json(
      { error: parsedData.error.errors[0].message },
      { status: 400 }
    );
  }

  return parsedData.data;
}
