"use client";

import { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useDebounce } from "@/hooks/use-debounce";
import LoadingSpinner from "@/components/ui/loading-spinner";
import {
  ProductListFilters,
  ProductListGrid,
  ProductListHeader,
  useProductFiltersState,
} from "@/src/features/product/product-list";

export default function ProductListPage() {
  const { t } = useTranslation("product");
  const {
    loading,
    filters,
    handleFilterChange,
    resetFilters,
    filteredProducts,
    appliedFilterCount,
  } = useProductFiltersState();

  const [searchValue, setSearchValue] = useState(filters.search ?? "");
  const debouncedSearch = useDebounce(searchValue, 300);

  const stableHandleFilterChange = useCallback(handleFilterChange, []);

  useEffect(() => {
    if (debouncedSearch !== filters.search) {
      stableHandleFilterChange({ search: debouncedSearch });
    }
  }, [debouncedSearch, stableHandleFilterChange, filters.search]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  return (
    <div className="bg-gray-100">
      <main className="p-6 max-w-7xl mx-auto">
        <ProductListHeader />

        <div className="mb-10">
          <input
            type="text"
            placeholder={t("search.placeholder")}
            className="w-full px-4 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            value={searchValue}
            onChange={handleSearchChange}
          />
        </div>

        <div className="bg-white p-8 rounded-3xl">
          <ProductListFilters
            appliedFilterCount={appliedFilterCount}
            filters={filters}
            handleFilterChange={stableHandleFilterChange}
            resetFilters={resetFilters}
          />

          {loading ? (
            <div className="flex flex-col items-center justify-center h-64">
              <LoadingSpinner size={20} />
              <p className="text-center text-gray-500 mt-6">{t("loading")}</p>
            </div>
          ) : (
            <ProductListGrid products={filteredProducts} />
          )}
        </div>
      </main>
    </div>
  );
}
