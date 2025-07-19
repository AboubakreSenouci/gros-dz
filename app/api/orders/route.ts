import { UserRole, OrderStatus } from "@/generated/prisma";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createPaginationSchema } from "@/src/shared/schema-validation.helpers";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { z } from "zod";

const CreateOrderSchema = z.object({
  productId: z.string().uuid({ message: "Invalid product ID format" }),
  quantity: z
    .number()
    .int()
    .positive({ message: "Quantity must be positive integer" }),
  paymentMethod: z.string().min(1, "Payment method is required"),
  shippingAddressId: z.string().optional(),
});

const OrderQueryParamsSchema = createPaginationSchema({
  status: z.nativeEnum(OrderStatus).optional(),
  companyId: z.string(),
});

export async function GET(request: Request) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.redirect("/signin");
    }

    const user = session.user;
    if (!user.role) {
      return NextResponse.json({ error: "Invalid user role" }, { status: 400 });
    }

    const { searchParams } = new URL(request.url);
    const queryParams = Object.fromEntries(searchParams.entries());

    const validation = await OrderQueryParamsSchema.safeParseAsync(queryParams);
    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.errors[0].message },
        { status: 400 }
      );
    }

    const { page = 1, pageSize = 10, status, companyId } = validation.data;

    const whereClause = {
      ...(user.role === UserRole.BUYER && {
        buyerCompanyId: companyId,
      }),
      ...(user.role === UserRole.SUPPLIER && {
        supplierCompanyId: companyId,
      }),
      ...(status && { status }),
    };

    const [orders, totalCount] = await prisma.$transaction([
      prisma.order.findMany({
        where: whereClause,
        orderBy: { createdAt: "desc" },
        include: {
          product: true,
          buyerCompany: true,
          supplierCompany: true,
        },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.order.count({ where: whereClause }),
    ]);

    return NextResponse.json({
      data: orders,
      pagination: {
        total: totalCount,
        page,
        pageSize,
        totalPages: Math.ceil(totalCount / pageSize),
      },
    });
  } catch (_error) {
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.redirect("/signin");
    }

    const user = session.user;
    if (user.role !== UserRole.BUYER) {
      return NextResponse.json(
        { error: "Only buyers can create orders" },
        { status: 403 }
      );
    }

    if (!user.companyId) {
      throw new Error("User does not have a companyId");
    }

    const body = await request.json();
    const validation = CreateOrderSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: validation.error.errors.map((e) => ({
            field: e.path.join("."),
            message: e.message,
          })),
        },
        { status: 400 }
      );
    }

    const { productId, quantity, paymentMethod, shippingAddressId } =
      validation.data;

    // Verify product exists
    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: {
        priceVariants: true,
        company: true,
      },
    });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // Business validations
    if (quantity < product.minOrderQuantity) {
      return NextResponse.json(
        {
          error: `Minimum order quantity is ${product.minOrderQuantity}`,
          minOrderQuantity: product.minOrderQuantity,
        },
        { status: 400 }
      );
    }

    if (quantity > product.quantityAvailable) {
      return NextResponse.json(
        {
          error: `Only ${product.quantityAvailable} units available`,
          availableQuantity: product.quantityAvailable,
        },
        { status: 400 }
      );
    }

    // Calculate price
    const calculatePrice = () => {
      const applicableVariant = product.priceVariants
        .filter((v) => v.quantity <= quantity)
        .sort((a, b) => b.quantity - a.quantity)[0];

      return applicableVariant?.price || product.price;
    };

    const unitPrice = calculatePrice();
    const totalPrice = unitPrice * quantity;

    // Verify shipping address exists if provided
    if (shippingAddressId) {
      const address = await prisma.address.findUnique({
        where: { id: shippingAddressId },
      });

      if (!address) {
        return NextResponse.json(
          { error: "Shipping address not found" },
          { status: 404 }
        );
      }
    }

    const counter = await prisma.orderCounter.update({
      where: { id: 1 },
      data: { lastNumber: { increment: 1 } },
    });

    const orderNumber = counter.lastNumber.toString();

    const order = await prisma.$transaction(async (tx) => {
      const newOrder = await tx.order.create({
        data: {
          orderNumber,
          quantity,
          totalPrice,
          paymentMethod,
          status: OrderStatus.PENDING,
          productId,
          buyerCompanyId: user.companyId!,
          supplierCompanyId: product.companyId,
          // we need to make a function to calculate this later.
          shippingDeliveryPrice: 0,
        },
        include: {
          product: true,
          buyerCompany: true,
          supplierCompany: true,
        },
      });

      // Update product quantity
      await tx.product.update({
        where: { id: productId },
        data: { quantityAvailable: { decrement: quantity } },
      });

      return newOrder;
    });

    return NextResponse.json(order, { status: 201 });
  } catch (_error) {
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 }
    );
  }
}
