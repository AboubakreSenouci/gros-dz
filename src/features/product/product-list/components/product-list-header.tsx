"use client";

import { useTranslation } from "react-i18next";

export function ProductListHeader() {
  const { t } = useTranslation("product");

  return (
    <>
      <h1 className="text-3xl font-bold mb-2 text-center">
        {t("header.title")}
      </h1>
      <p className="text-center text-muted-foreground text-sm mb-6">
        {t("header.subtitle")}
      </p>
    </>
  );
}
