import { z } from "zod";

type ProductFiltersTranslationKeys =
  | "product_filters.price.from_required"
  | "product_filters.price.from_invalid"
  | "product_filters.price.from_min"
  | "product_filters.price.to_required"
  | "product_filters.price.to_invalid"
  | "product_filters.price.to_max";

export const productFiltersSchema = (
  t: (key: ProductFiltersTranslationKeys) => string
) => {
  return z.object({
    price: z.object({
      from: z
        .number({
          required_error: t("product_filters.price.from_required"),
          invalid_type_error: t("product_filters.price.from_invalid"),
        })
        .min(0, { message: t("product_filters.price.from_min") }),
      to: z
        .number({
          required_error: t("product_filters.price.to_required"),
          invalid_type_error: t("product_filters.price.to_invalid"),
        })
        .max(1000, { message: t("product_filters.price.to_max") }),
    }),
    sort_option: z.string().default(""),
    category: z.string().default(""),
  });
};

export type ProductFiltersFormValues = z.infer<
  ReturnType<typeof productFiltersSchema>
>;
