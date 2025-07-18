import React, { useMemo } from "react";
import { useController, useFormContext } from "react-hook-form";
import { X } from "lucide-react";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "..";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

export type SelectEnumOption<T> = {
  label: string;
  value: T;
};

export type FormSelectEnumFieldProps<T> = {
  name: string;
  label?: string;
  placeholder?: string;
  description?: string;
  options: SelectEnumOption<T>[];
  disabled?: boolean;
  className?: string;
  onChange?: (value: T) => void;
  showClear?: boolean;
};

export const FormSelectEnumField = <T,>(props: FormSelectEnumFieldProps<T>) => {
  const { control } = useFormContext();
  const { field } = useController({
    control,
    name: props.name,
  });

  const selectedOptionLabel = useMemo(() => props.options.find(
    (option) => option.value === field.value
  ), [props.options, field.value])?.label ?? props.label;

  const handleClear = () => {
    field.onChange("");
    props.onChange?.("" as T);
  };

  return (
    <FormField
      control={control}
      name={props.name}
      render={() => (
        <FormItem className="space-y-0">
          <FormLabel>{props.label}</FormLabel>
          <FormControl>
            <div className="relative space-y-0">
              <Select
                value={String(field.value)}
                onValueChange={(value) => {
                  field.onChange(value);
                  props.onChange?.(value as T);
                }}
                {...props}
              >
                <SelectTrigger
                  className={cn("w-full max-w-2xl", props.className, {
                    "pr-8": field.value && props.showClear,
                  })}
                >
                  <SelectValue placeholder={props.placeholder}>
                    {selectedOptionLabel}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {props.options.map((option) => (
                    <SelectItem
                      key={String(option.value)}
                      value={String(option.value)}
                    >
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {field.value && props.showClear && (
                <button
                  type="button"
                  onClick={handleClear}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </FormControl>
          {props.description && (
            <FormDescription>{props.description}</FormDescription>
          )}
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
