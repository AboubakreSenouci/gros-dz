import { ProductFilters, ProductQuickFilters } from "../../product-filters";
import { useCallback } from "react";
import {
  ProductFiltersDefaultValues,
  ProductListFiltersProps,
} from "../../product-filters/types";
import { useProductFiltersForm } from "../../product-filters/hooks/use-product-filters-form";

export function ProductListFilters({
  filters,
  handleFilterChange,
  resetFilters,
  appliedFilterCount,
}: ProductListFiltersProps) {
  const { isDirty, ...form } = useProductFiltersForm(filters);

  const applyFilters = useCallback(
    (values: Partial<typeof filters>) => {
      handleFilterChange(values);
      form.reset(values);
    },
    [handleFilterChange, form]
  );

  const handleReset = () => {
    resetFilters();
    form.reset(ProductFiltersDefaultValues);
  };

  return (
    <div className="flex gap-4">
      <div className="flex items-center w-full gap-6 mb-10">
        <ProductFilters
          appliedFilterCount={appliedFilterCount}
          resetFilters={handleReset}
          onApply={applyFilters}
          filters={filters}
        />

        <ProductQuickFilters filters={filters} onSubmit={applyFilters} />
      </div>
    </div>
  );
}
