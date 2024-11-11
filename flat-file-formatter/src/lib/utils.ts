import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import Decimal from "decimal.js";

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
  return tokens.filter((token) => token.length > 0);
}

export function interpretValue(
  row: string[],
  fields: string[],
  value: string,
): string {
  const slicingRegex = /^{([^[\]]+)(?:\[([^]+)\])?}$/;
  const match = value.match(slicingRegex);

  if (!match) {
    return value;
  }

  const fieldName = match[1];
  const slicingExpression = match[2];
  const fieldIndex = fields.indexOf(fieldName);

  if (fieldIndex === -1) {
    return value;
  }

  if (!slicingExpression) {
    return row[fieldIndex];
  }

  const [start, end] =
    slicingExpression
      .split(":")
      .map((part) => (part ? parseInt(part, 10) : undefined)) ?? [];

  return row[fieldIndex].slice(start ?? 0, end);
}

// Following functions adapted from the Python library "overpunch" by truveris
// Original source: https://github.com/truveris/overpunch/tree/master

const FromStandardMap: Record<string, [string, string]> = {
  "0": ["", "0"],
  "1": ["", "1"],
  "2": ["", "2"],
  "3": ["", "3"],
  "4": ["", "4"],
  "5": ["", "5"],
  "6": ["", "6"],
  "7": ["", "7"],
  "8": ["", "8"],
  "9": ["", "9"],
  "{": ["", "0"],
  A: ["", "1"],
  B: ["", "2"],
  C: ["", "3"],
  D: ["", "4"],
  E: ["", "5"],
  F: ["", "6"],
  G: ["", "7"],
  H: ["", "8"],
  I: ["", "9"],
  "}": ["-", "0"],
  J: ["-", "1"],
  K: ["-", "2"],
  L: ["-", "3"],
  M: ["-", "4"],
  N: ["-", "5"],
  O: ["-", "6"],
  P: ["-", "7"],
  Q: ["-", "8"],
  R: ["-", "9"],
};

export function fromOverpunch(raw: string, decimals: number = 2): string {
  const length = raw.length;
  const [sign, cent] = FromStandardMap[raw[length - 1]];
  const core = decimals
    ? raw.slice(0, length - decimals) + "." + raw.slice(length - decimals, -1)
    : raw.slice(0, length - 1);

  return sign + core + cent;
}

const ToOverpunchMap: Record<string, string> = {
  "+0": "{",
  "+1": "A",
  "+2": "B",
  "+3": "C",
  "+4": "D",
  "+5": "E",
  "+6": "F",
  "+7": "G",
  "+8": "H",
  "+9": "I",
  "-0": "}",
  "-1": "J",
  "-2": "K",
  "-3": "L",
  "-4": "M",
  "-5": "N",
  "-6": "O",
  "-7": "P",
  "-8": "Q",
  "-9": "R",
};

export function toOverpunch(
  val: number | string | Decimal,
  decimals: number = 2,
  rounding = Decimal.ROUND_HALF_UP,
): string {
  const decimalVal = val instanceof Decimal ? val : new Decimal(val);
  if (decimalVal.isNaN()) throw new Error(`${val.toString()} is NaN`);

  const quantizedVal = decimalVal.toFixed(decimals, rounding).replace(/^-/, "");
  const sign = decimalVal.isNegative() ? "-" : "+";
  const formattedLastDigit = ToOverpunchMap[sign + quantizedVal.slice(-1)];

  return quantizedVal.slice(0, -1).replace(".", "") + formattedLastDigit;
}
