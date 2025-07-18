import { useMemo } from "react";
import { filterAndSortProducts } from "@/lib/utils";

export function useFilteredProducts(products: any[], filters: any) {
  return useMemo(() => {
    return filterAndSortProducts({
      products,
      ...filters,
    });
  }, [
    products,
    filters.search,
    filters.category,
    filters.sort_option,
    filters.price.from,
    filters.price.to,
  ]);
}
