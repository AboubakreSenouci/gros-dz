"use client";

import { useTranslation } from "react-i18next";
import ProductCard from "@/src/components/product-card/product-card.component";

export function ProductListGrid({ products }: { products: {
    id: number;
    name: string;
    description: string;
    price: number;
}[]}) {
  const { t } = useTranslation("product");

  return (
    <div className="">
      <p className="text-sm text-muted-foreground mb-2">
        {t("products.showing_results", { count: products.length })}
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-5 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
