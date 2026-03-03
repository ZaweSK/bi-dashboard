import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Parse a string to number, returning null if not valid */
export function toNumber(value: string): number | null {
  const n = parseFloat(value.replace(/,/g, ""));
  return isNaN(n) ? null : n;
}

/** Format a number with commas */
export function formatNumber(value: number, decimals = 2): string {
  return value.toLocaleString("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}
