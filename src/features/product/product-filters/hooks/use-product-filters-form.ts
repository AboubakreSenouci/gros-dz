import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ProductFiltersFormValues,
  productFiltersSchema,
} from "@/src/features/product/product-filters/schema";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import _ from "lodash";

export const useProductFiltersForm = (
  initialValues: ProductFiltersFormValues
) => {
  const { t } = useTranslation("product");
  const schema = productFiltersSchema(t);

  const form = useForm<ProductFiltersFormValues>({
    resolver: zodResolver(schema),
    defaultValues: initialValues,
    values: initialValues,
  });

  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    const subscription = form.watch((values) => {
      setIsDirty(!_.isEqual(values, initialValues));
    });
    return () => subscription.unsubscribe();
  }, [form, initialValues]);

  return {
    ...form,
    isDirty,
  };
};
