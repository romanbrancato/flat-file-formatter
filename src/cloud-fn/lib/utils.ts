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
