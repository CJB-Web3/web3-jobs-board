import { type ClassValue, clsx } from "clsx";
import { formatDistance, parseISO } from "date-fns";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(
  amount: number,
  currency: "usd" | "eur" | "gbp"
): string {
  const currencyOptions: {
    [key: string]: { locale: string; currency: string };
  } = {
    usd: { locale: "en-US", currency: "USD" },
    eur: { locale: "en-US", currency: "EUR" },
    gbp: { locale: "en-US", currency: "GBP" },
  };

  const { locale, currency: currencyCode } = currencyOptions[currency];

  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currencyCode,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
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

export const getToday = function (options = {}) {
  const today = new Date();

  // This is necessary to compare with created_at from Supabase, because it it not at 0.0.0.0, so we need to set the date to be END of the day when we compare it with earlier dates
  // if (options?.end)
  //   // Set to the last second of the day
  //   today.setUTCHours(23, 59, 59, 999);
  today.setUTCHours(0, 0, 0, 0);
  return today.toISOString();
};

export const formatDistanceFromNow = (dateStr: string) =>
  formatDistance(parseISO(dateStr), new Date(), {
    addSuffix: true,
  });
// .replace("about ", "")
// .replace("in", "In");
