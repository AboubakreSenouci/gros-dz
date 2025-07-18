import { isEqual, omitBy } from "lodash";
import { CountableFilters } from "./types";

export function getAppliedFilterCount(
  values: CountableFilters,
  initialValues: CountableFilters
): number {
  const applied = omitBy(values, (value, key) =>
    isEqual(value, initialValues[key as keyof CountableFilters])
  );
  return Object.keys(applied).length;
}
