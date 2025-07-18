"use client";

import { useTranslation } from "react-i18next";
import { FormTextField } from "../form-text-field";

interface PriceRangeInputProps {
  placeholderFrom?: string;
  placeholderTo?: string;
}

export function PriceRangeInput({
  placeholderFrom = "0",
  placeholderTo = "1000",
}: PriceRangeInputProps) {
  const { t } = useTranslation("component");

  return (
    <div className="flex gap-2">
      <FormTextField
        name="price.from"
        label={t("price.from")}
        placeholder={placeholderFrom}
        type="number"
      />
      <FormTextField
        name="price.to"
        label={t("price.to")}
        placeholder={placeholderTo}
        type="number"
      />
    </div>
  );
}
