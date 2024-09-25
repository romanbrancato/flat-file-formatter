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

export function evaluateCondition(
  fields: string[],
  row: string[],
  condition: any,
): boolean {
  const leftVal = row[fields.indexOf(condition.field.name)];
  const rightVal =
    condition.value.startsWith("{") && condition.value.endsWith("}")
      ? row[fields.indexOf(condition.value.slice(1, -1).trim())]
      : condition.value;

  let conditionPasses = false;
  switch (condition.comparison) {
    case "<":
      conditionPasses = Number(leftVal) < Number(rightVal);
      break;
    case ">":
      conditionPasses = Number(leftVal) > Number(rightVal);
      break;
    case "=":
      conditionPasses = leftVal === rightVal;
      break;
  }

  return condition.statement === "if not" ? !conditionPasses : conditionPasses;
}

// Following functions adapted from the Python library "overpunch" by truveris
// Original source: https://github.com/truveris/overpunch/tree/master

const EXTRACT_REF: Record<string, [string, string]> = {
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

export function extract(raw: string, decimals: number = 2): string {
  const length = raw.length;
  const lastChar = raw[length - 1];
  const [sign, cent] = EXTRACT_REF[lastChar];

  let core: string;
  if (!decimals) {
    core = raw.slice(0, length - 1);
  } else {
    core =
      raw.slice(0, length - decimals) + "." + raw.slice(length - decimals, -1);
  }

  return sign + core + cent;
}

const FORMAT_REF: Record<string, string> = {
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

export function format(
  val: number | string | Decimal,
  decimals: number = 2,
  rounding = Decimal.ROUND_HALF_UP,
): string {
  // Convert val to Decimal if it's not already
  if (!(val instanceof Decimal)) {
    val = new Decimal(val);
  }

  // Check for NaN
  if (val.isNaN()) {
    throw new Error(`${val.toString()} is NaN`);
  }

  // Quantize the value to the specified number of decimals
  let quantizedVal = val.toFixed(decimals, rounding);

  // Determine the sign and remove it for formatting
  let sign = quantizedVal[0] === "-" ? "-" : "+";
  quantizedVal = quantizedVal.replace(/^-/, ""); // Remove the sign for formatting

  // Remove the decimal point
  quantizedVal = quantizedVal.replace(".", "");

  // Get the last digit and replace it with the corresponding format character
  let lastDigit = quantizedVal.slice(-1);
  let formattedLastDigit = FORMAT_REF[sign + lastDigit];

  // Replace the last digit with the formatted one
  quantizedVal = quantizedVal.slice(0, -1) + formattedLastDigit;

  return quantizedVal;
}
