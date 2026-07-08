import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPhone(phone: string) {
  let p = phone.replace(/\D/g, "");
  if (p.startsWith("0")) p = "62" + p.substring(1);
  return p;
}

export function createWhatsAppLink(phone: string, message: string) {
  return `https://wa.me/${formatPhone(phone)}?text=${encodeURIComponent(message)}`;
}

