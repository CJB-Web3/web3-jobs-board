import { type ClassValue, clsx } from "clsx";
import { formatDistance, parseISO } from "date-fns";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatSalaryCurrency(
  amount: number,
  currency: "USD" | "EUR" | "GBP"
): string {
  return (
    new Intl.NumberFormat("en-US", {
      style: "decimal",
      maximumFractionDigits: 0,
    }).format(amount) +
    " " +
    currency
  );
}

export const getToday = function () {
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);
  return today.toISOString();
};

export const formatDistanceFromNow = (dateStr: string) =>
  formatDistance(parseISO(dateStr), new Date(), {
    addSuffix: true,
  });
