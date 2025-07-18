"use client";

import { useTranslation } from "react-i18next";
import { FormTextField } from "@/src/components/form/form-text-field";
import { CategoryFilter, SortFilter } from "../../components";

export function ProductFiltersFields() {
  const { t } = useTranslation("product");

  return (
    <div className="flex flex-col space-y-4">
      <div className="space-y-4">
        <p className="text-sm font-medium">{t("filters.price_range")}</p>
        <div className="flex gap-2">
          <FormTextField
            name="priceMin"
            label={t("filters.min_price")}
            type="number"
            placeholder={t("filters.min_price")}
          />
          <FormTextField
            name="priceMax"
            label={t("filters.max_price")}
            type="number"
            placeholder={t("filters.max_price")}
          />
        </div>
      </div>

      <SortFilter onChange={() => {}} />
      <CategoryFilter onChange={() => {}} />
    </div>
  );
}
