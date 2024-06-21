import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function download(data: string, name: string, ext: string) {
  const url = URL.createObjectURL(new Blob([data]));
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", `${name}.${ext}`);
  link.click();
}

export function tokenize(fileName: string): string[] {
  // Regular expression to match non-alphanumeric characters as delimiters
  const regex = /[^a-zA-Z0-9]+/;

  const tokens = fileName.split(regex);
  // Remove any empty tokens resulting from consecutive delimiters
  return tokens.filter(token => token.length > 0);
}

