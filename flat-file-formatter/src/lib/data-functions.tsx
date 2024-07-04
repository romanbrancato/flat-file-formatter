import { Function, Preset } from "@/context/preset-context";
import { tokenize } from "@/lib/utils";

export function setName(originalName: string, schema = ""): string {
  if (!schema) return originalName;
  const tokenized = tokenize(originalName);
  return schema.replace(/{(\d+)}/g, (match: string, index: string) => {
    const tokenIndex = parseInt(index, 10);
    return tokenized[tokenIndex] ?? "";
  });
}

export function removeField(
  data: Record<string, unknown>[],
  field: string,
): Record<string, unknown>[] {
  return data.map((row) => {
    delete row[field];
    return row;
  });
}

export function addField(
  data: Record<string, unknown>[],
  field: Record<string, unknown>,
): Record<string, unknown>[] {
  return data.map((row) => ({ ...field, ...row }));
}

export function orderFields(
  data: Record<string, unknown>[],
  order: string[],
): Record<string, unknown>[] {
  return data.map((record) => {
    const reorderedRecord: Record<string, unknown> = {};
    order.forEach((field: string) => {
      if (field in record) {
        reorderedRecord[field] = record[field];
      }
    });
    return reorderedRecord;
  });
}

export function editHeader(
  data: Record<string, unknown>[],
  field: Record<string, string>,
): Record<string, unknown>[] {
  return data.map((row) => {
    const [oldCol, newCol] = Object.entries(field)[0];
    if (oldCol in row) {
      return {
        ...Object.fromEntries(
          Object.entries(row).map(([key, val]) =>
            key === oldCol ? [newCol, val] : [key, val],
          ),
        ),
      };
    }
    return row;
  });
}

export function runFunction(
  data: Record<string, unknown>[],
  func: Function,
): Record<string, unknown>[] {
  return data.map((row) => {
    const { field, operation, condition, resultField, valueTrue, valueFalse } =
      func;

    const matches =
      condition === "*" ||
      (operation === "if" && row[field] === condition) ||
      (operation === "if not" && row[field] !== condition);

    const value = matches
      ? valueTrue !== "..."
        ? valueTrue
        : row[resultField]
      : valueFalse !== "..."
        ? valueFalse
        : row[resultField];

    return { ...row, [resultField]: value };
  });
}

export function applyPreset(data: Record<string, unknown>[], preset: Preset) {
  preset.removed?.forEach((field) => {
    data = removeField(data, field);
  });

  preset.added?.forEach((item) => {
    data = addField(data, item);
  });

  preset.editedHeaders?.forEach((item) => {
    data = editHeader(data, item);
  });

  preset.functions?.forEach((item) => {
    data = runFunction(data, item);
  });

  data = orderFields(data, preset.order);

  return data;
}
