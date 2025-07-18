"use client";

import { useState } from "react";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { PriceRangeInput } from "@/src/components/form/form-range-input";
import { FormItem, FormLabel, FormControl } from "../../../../components/form";
import { DEFAULT_PRICE_RANGE, getRangeDisplayLabel } from "./utils";
import { ChevronDown, X } from "lucide-react";

interface PriceRangeFilterProps {
  name: string;
  label?: string;
  onApply?: () => void;
  onClear?: () => void;
  defaultRange?: { from: number; to: number };
}

export function PriceRangeFilter({
  name,
  label: externalLabel,
  onApply,
  onClear,
  defaultRange = DEFAULT_PRICE_RANGE,
}: PriceRangeFilterProps) {
  const { t } = useTranslation("component");
  const { getValues, setValue, handleSubmit } = useFormContext();
  const [isOpen, setIsOpen] = useState(false);

  const nameFrom = `${name}.from`;
  const nameTo = `${name}.to`;

  const currentFrom = Number(getValues(nameFrom)) || defaultRange.from;
  const currentTo = Number(getValues(nameTo)) || defaultRange.to;

  const isCustomRange =
    currentFrom !== defaultRange.from || currentTo !== defaultRange.to;

  const label = getRangeDisplayLabel(
    currentFrom,
    currentTo,
    defaultRange.from,
    defaultRange.to,
    t
  );

  const handleApply = () => {
    onApply?.();
    setIsOpen(false);
  };

  const handleClear = () => {
    setValue(nameFrom, defaultRange.from);
    setValue(nameTo, defaultRange.to);
    onClear?.();
    onApply?.();
  };

  return (
    <FormItem>
      {externalLabel && <FormLabel>{externalLabel}</FormLabel>}
      <FormControl>
        <div className="relative">
          <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className={`w-[160px] justify-between font-normal ${
                  isCustomRange ? "pr-8" : "pr-3"
                }`}
              >
                {label}
                <ChevronDown className="h-4 w-4" />
              </Button>
            </PopoverTrigger>

            <PopoverContent className="w-64 space-y-4">
              <PriceRangeInput />
              <Button
                type="button"
                size="sm"
                className="w-full"
                onClick={handleSubmit(handleApply)}
              >
                {t("price.apply")}
              </Button>
            </PopoverContent>
          </Popover>

          {isCustomRange && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </FormControl>
    </FormItem>
  );
}
