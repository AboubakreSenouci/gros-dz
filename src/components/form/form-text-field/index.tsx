import React, { HTMLInputTypeAttribute, ReactNode } from "react";
import { useFormContext } from "react-hook-form";

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "..";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";

type FormTextFieldProps = {
  name: string;
  label: string;
  placeholder?: string;
  description?: string;
  disabled?: boolean;
  type?: HTMLInputTypeAttribute;
  prefixIcon?: ReactNode;
};

export const FormTextField = (props: FormTextFieldProps) => {
  const { control } = useFormContext();

  return (
    <FormField
      control={control}
      name={props.name}
      render={({ field }) => {
        const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
          const value =
            props.type === "number" ? Number(e.target.value) : e.target.value;
          field.onChange(value);
        };

        return (
          <FormItem>
            <FormLabel>{props.label}</FormLabel>
            <FormControl>
              <div className="relative [&_svg]:size-4 [&_svg]:text-muted-foreground [&_svg]:absolute [&_svg]:left-3 [&_svg]:top-1/2 [&_svg]:-translate-y-1/2">
                {props.prefixIcon}
                <Input
                  placeholder={props.placeholder}
                  className={cn(props.prefixIcon && "pl-8")}
                  {...field}
                  onChange={handleChange}
                  disabled={props.disabled}
                  type={props.type}
                />
              </div>
            </FormControl>
            {props.description && (
              <FormDescription>{props.description}</FormDescription>
            )}
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
};
