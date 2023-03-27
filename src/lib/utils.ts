import { clsx } from "clsx";
import type { ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const shortenAddress = (address: string) =>
  `${address.slice(0, 4)}...${address.slice(address.length - 4)}`;

export const toUSD = (amount: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    currencyDisplay: "narrowSymbol",
  }).format(amount);
};

export const formatNumber = (value: number) => {
  return new Intl.NumberFormat().format(value);
};
