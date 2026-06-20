import type { DropdownOption } from "@/components/ui/Dropdown";

const YEAR_START = 1900;

export function buildYearOptions(emptyLabel = "Any"): DropdownOption[] {
  const currentYear = new Date().getFullYear();
  const options: DropdownOption[] = [{ value: "", label: emptyLabel }];

  for (let year = currentYear; year >= YEAR_START; year -= 1) {
    options.push({ value: String(year), label: String(year) });
  }

  return options;
}

export function yearValueToNumber(value: string): number | null {
  if (!value) return null;
  const parsed = Number.parseInt(value, 10);
  return Number.isNaN(parsed) ? null : parsed;
}

export function yearNumberToValue(value: number | null): string {
  return value != null ? String(value) : "";
}