import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function sleep(n: number = 500) {
  return new Promise((r) => setTimeout(r, n));
}

export const isEqual = <T extends Record<string, unknown>>(option: T, emptyObject: T): boolean => {
  return Object.keys(option).length === 0 && Object.keys(emptyObject).length === 0;
};