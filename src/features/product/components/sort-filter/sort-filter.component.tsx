"use client";

import { useTranslation } from "react-i18next";
import { FormSelectEnumField } from "@/src/components/form/form-select-field";
import { sortOptions } from "@/constants/product";
import { TFunction } from "i18next";

interface SortFilterProps {
  onChange?: () => void;
  className?: string;
}

function translateOptions<T extends { value: string }>(
  options: T[],
  t: TFunction,
  prefix: string
): T[] {
  return options.map((opt) => ({
    ...opt,
    label: t(`${prefix}.${opt.value}`),
  }));
}

export function SortFilter({ onChange, className }: SortFilterProps) {
  const { t } = useTranslation("component");

  const translatedOptions = translateOptions(sortOptions, t, "sort_options");

  return (
    <FormSelectEnumField
      name="sort_option"
      placeholder={t("sort.placeholder")}
      options={translatedOptions}
      className={className}
      onChange={onChange}
    />
  );
}
