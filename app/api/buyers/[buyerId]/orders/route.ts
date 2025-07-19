import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createOrderSchema } from "@/lib/validations/order-schema";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.redirect("/signin");
    }

    const user = session.user;
    if (user. !== "BUYER") {
      return NextResponse.json(
        { error: "Only buyers can create orders" },
        { status: 403 }
      );
    }

    // 3. Input validation
    const body = await request.json();
    const validation = createOrderSchema.safeParse(body);

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

    const { productId, quantity, paymentMethod } = validation.data;

    // 4. Verify product exists and get supplier
    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: {
        priceVariants: true,
        supplier: true,
      },
    });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // 5. Business validations
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

    // 6. Calculate price (considering tiered pricing)
    const getUnitPrice = () => {
      const applicableVariant = product.priceVariants
        .filter((v) => v.quantity <= quantity)
        .sort((a, b) => b.quantity - a.quantity)[0];

      return applicableVariant?.price || product.price;
    };

    const unitPrice = getUnitPrice();
    const totalPrice = unitPrice * quantity;

    // 7. Create order in transaction
    const order = await prisma.$transaction(async (tx) => {
      // Create the order
      const newOrder = await tx.order.create({
        data: {
          orderNumber: `ORD-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
          quantity,
          totalPrice,
          paymentMethod,
          status: "PENDING",
          productId,
          buyerId: user.buyerId!,
          supplierId: product.supplierId,
          shippingAddress: validation.data.shippingAddress,
        },
        include: {
          product: true,
          buyer: true,
          supplier: true,
        },
      });

      // Update inventory
      await tx.product.update({
        where: { id: productId },
        data: { quantityAvailable: { decrement: quantity } },
      });

      return newOrder;
    });

    // 8. Return success response
    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    console.error("[ORDER_CREATION_ERROR]", error);

    // Handle specific Prisma errors
    if (error instanceof Error && "code" in error) {
      if (error.code === "P2002") {
        return NextResponse.json(
          { error: "Order number conflict - please try again" },
          { status: 409 }
        );
      }
      if (error.code === "P2025") {
        return NextResponse.json(
          { error: "Related record not found" },
          { status: 404 }
        );
      }
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
