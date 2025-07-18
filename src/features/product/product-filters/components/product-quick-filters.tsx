"use client";

import { RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Form } from "@/src/components/form";
import { useTranslation } from "react-i18next";
import { CategoryFilter, PriceRangeFilter, SortFilter } from "../../components";
import {
  ProductFiltersDefaultValues,
  ProductQuickFiltersProps,
} from "../types";
import { useProductFiltersForm } from "../hooks/use-product-filters-form";

export function ProductQuickFilters({
  onSubmit,
  filters,
}: ProductQuickFiltersProps) {
  const { t } = useTranslation("product");
  const { isDirty, ...form } = useProductFiltersForm(filters);
  const handleReset = () => {
    form.reset(ProductFiltersDefaultValues);
    onSubmit(ProductFiltersDefaultValues);
  };

  const handleOnChange = async () => {
    onSubmit(form.getValues());
  };

  return (
    <Form {...form}>
      <form className="flex items-center flex-row justify-between w-full">
        <div className="flex gap-4 items-center">
          <CategoryFilter onChange={handleOnChange} className="w-40" />

          <PriceRangeFilter name="price" onApply={handleOnChange} />

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleReset}
            className="px-3 text-sm flex items-center gap-1 font-normal"
          >
            <RotateCcw className="w-4 h-4" />
            {t("quick_filters.reset")}
          </Button>
        </div>
        <div>
          <SortFilter onChange={handleOnChange} className="w-fit" />
        </div>
      </form>
    </Form>
  );
}
