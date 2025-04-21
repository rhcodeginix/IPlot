// @ts-nocheck
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export const isAuthenticated = () => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("min_tomt_login");
    return token ? true : false;
  }
  return false;
};

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
