import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const convertToDecimal = (value: number) => {
  return value.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, "$&,");
};