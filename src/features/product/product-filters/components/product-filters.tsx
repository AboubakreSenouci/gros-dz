"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SlidersHorizontal } from "lucide-react";
import { useState } from "react";
import {
  ProductFiltersDefaultValues,
  ProductFiltersProps,
  ProductFiltersValues,
} from "../types";
import { FormSubmitButton } from "@/src/components/form/form-submit-button";
import { Form } from "@/src/components/form";
import _, { isEqual } from "lodash";
import { useTranslation } from "react-i18next";
import { CategoryFilter } from "../../components";
import { PriceRangeInput } from "@/src/components/form/form-range-input";
import { useProductFiltersForm } from "../hooks/use-product-filters-form";

export function ProductFilters({
  resetFilters,
  onApply,
  appliedFilterCount,
  filters,
}: ProductFiltersProps) {
  const { t } = useTranslation("product");
  const [open, setOpen] = useState(false);

  const { isDirty, ...form } = useProductFiltersForm(filters);

  const handleReset = () => {
    resetFilters();
    form.reset(ProductFiltersDefaultValues);
    setOpen(false);
  };

  const onSubmit = (data: ProductFiltersValues) => {
    onApply(data);
    setOpen(false);
  };
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-1 w-32 font-normal"
        >
          <SlidersHorizontal className="w-4 h-4" />
          {t("filters.button")}
          {appliedFilterCount > 0 && (
            <Badge variant="destructive" className="text-white">
              {appliedFilterCount}
            </Badge>
          )}
        </Button>
      </SheetTrigger>

      <SheetContent className="w-[300px] sm:w-[350px]">
        <SheetHeader>
          <SheetTitle>{t("filters.title")}</SheetTitle>
        </SheetHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="mt-4 space-y-6 px-4 flex flex-col justify-between h-full"
          >
            <div className="flex flex-col space-y-4">
              <div className="space-y-4">
                <p className="text-sm font-medium">
                  {t("filters.price_range")}
                </p>
                <PriceRangeInput />
              </div>

              <CategoryFilter />
            </div>

            <div className="flex flex-col mb-4 gap-2 mt-auto">
              <FormSubmitButton className="w-full" disabled={!isDirty}>
                {t("filters.apply")}
              </FormSubmitButton>
              <FormSubmitButton
                type="button"
                variant="secondary"
                className="w-full"
                onClick={handleReset}
                disabled={isEqual(
                  form.getValues(),
                  ProductFiltersDefaultValues
                )}
              >
                {t("filters.reset")}
              </FormSubmitButton>
            </div>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}
