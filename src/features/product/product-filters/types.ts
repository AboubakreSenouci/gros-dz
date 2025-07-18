export type ProductFiltersValues = {
  price: {
    from: number;
    to: number;
  };
  sort_option: string;
  category: string;
  search?: string;
};

export type CountableFilters = Omit<
  ProductFiltersValues,
  "search" | "sort_option"
>;

export interface ProductFiltersProps {
  resetFilters: () => void;
  onApply: (filters: ProductFiltersValues) => void;
  filters: ProductFiltersValues;
  appliedFilterCount: number;
}

export const ProductFiltersDefaultValues: ProductFiltersValues = {
  category: "",
  price: {
    from: 0,
    to: 1000,
  },
  sort_option: "price_asc",
  search: "",
};

export const CountableFiltersDefaultValues: CountableFilters = {
  category: "",
  price: {
    from: 0,
    to: 1000,
  },
};

export interface ProductQuickFiltersProps {
  onSubmit: (data: ProductFiltersValues) => void;
  filters: ProductFiltersValues;
}

export type ProductListFilters = ProductFiltersValues & {
  search: string;
};

export interface ProductListFiltersProps {
  filters: ProductFiltersValues;
  handleFilterChange: (v: Partial<ProductListFilters>) => void;
  resetFilters: () => void;
  appliedFilterCount: number;
}
