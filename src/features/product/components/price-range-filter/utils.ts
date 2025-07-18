import { TFunction } from "i18next";

export const formatCurrency = (value: number, currency = "USD") => {
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(value);
};

export const getRangeDisplayLabel = (
  currentFrom: number,
  currentTo: number,
  defaultFrom: number,
  defaultTo: number,
  t: TFunction<"component", undefined>
) => {
  const isDefault = currentFrom === defaultFrom && currentTo === defaultTo;
  return isDefault
    ? t("price.label")
    : `${formatCurrency(currentFrom)} - ${formatCurrency(currentTo)}`;
};

export const DEFAULT_PRICE_RANGE = { from: 0, to: 1000 };
