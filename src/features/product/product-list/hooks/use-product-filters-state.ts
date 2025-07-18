import { useState, useMemo } from "react";
import { useProducts } from "@/hooks/use-products";
import { useFilteredProducts } from "@/hooks/use-filtered-products";
import { getAppliedFilterCount } from "../../product-filters/utils";
import {
  ProductFiltersDefaultValues,
  CountableFiltersDefaultValues,
} from "../../product-filters/types";
import _ from "lodash";

export function useProductFiltersState() {
  const { products, loading } = useProducts();
  const [filters, setFilters] = useState(ProductFiltersDefaultValues);

  const handleFilterChange = (changes: Partial<typeof filters>) => {
    setFilters((prev) => ({ ...prev, ...changes }));
  };

  const resetFilters = () => setFilters(ProductFiltersDefaultValues);

  const filteredProducts = useFilteredProducts(products, filters);

  const appliedFilterCount = useMemo(() => {
    const { search, sort_option, ...countableFilters } = filters;
    return getAppliedFilterCount(
      countableFilters,
      CountableFiltersDefaultValues
    );
  }, [filters]);

  return {
    loading,
    filters,
    handleFilterChange,
    resetFilters,
    filteredProducts,
    appliedFilterCount,
  };
}
