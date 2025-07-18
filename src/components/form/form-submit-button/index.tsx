import { Button, ButtonProps } from "@/components/ui/button";
import React from "react";
import { useFormContext } from "react-hook-form";

export const FormSubmitButton = (props: ButtonProps) => {
  const { formState } = useFormContext();
  return (
    <Button
      type="submit"
      disabled={!formState.isValid}
      loading={formState.isSubmitting}
      {...props}
    />
  );
};
