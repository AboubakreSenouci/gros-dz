"use client";

import { useTranslation } from "react-i18next";

import { categories } from "@/constants/product";
import { FormSelectEnumField } from "@/src/components/form/form-select-field";

interface CategoryFilterProps {
  onChange?: () => void;
  className?: string;
}

export function CategoryFilter({ onChange, className }: CategoryFilterProps) {
  const { t } = useTranslation("component");

  return (
    <FormSelectEnumField
      name="category"
      placeholder={t("category.placeholder")}
      options={categories.map((cat) => ({ label: cat, value: cat }))}
      className={className}
      onChange={onChange}
      showClear={true}
    />
  );
}
