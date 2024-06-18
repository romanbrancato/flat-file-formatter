import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function download(flatData: string, name: string, ext: string) {
  const url = URL.createObjectURL(new Blob([flatData]));
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", `${name}.${ext}`);
  link.click();
}
