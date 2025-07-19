import { z } from "zod";

export const createOrderSchema = z.object({
  productId: z.string().uuid({ message: "Invalid product ID format" }),
  quantity: z
    .number()
    .int()
    .positive({ message: "Quantity must be positive integer" }),
  paymentMethod: z.enum(["CARD", "BANK_TRANSFER", "COD"], {
    errorMap: () => ({ message: "Invalid payment method" }),
  }),
  shippingAddress: z.string().min(10, "Address too short").optional(),
});
