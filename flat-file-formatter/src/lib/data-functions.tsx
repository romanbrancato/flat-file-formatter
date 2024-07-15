import { Function, Preset } from "@/context/preset-context";
import { tokenize } from "@/lib/utils";
import { Data } from "@/lib/parser-functions";

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
  return data.map((record) => {
    delete record[field];
    return record;
  });
}

export function addField(
  data: Record<string, unknown>[],
  field: Record<string, unknown>,
): Record<string, unknown>[] {
  return data.map((record) => ({ ...field, ...record }));
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
  fn: Function,
): Record<string, unknown>[] {
  return data.map((record) => {
    const { field, operation, condition, resultField, valueTrue, valueFalse } =
      fn;

    const matches =
      condition === "*" ||
      (operation === "if" && record[field.name] === condition) ||
      (operation === "if not" && record[field.name] !== condition);

    const value = matches
      ? valueTrue !== "..."
        ? valueTrue
        : record[resultField.name]
      : valueFalse !== "..."
        ? valueFalse
        : record[resultField.name];

    return { ...record, [resultField.name]: value };
  });
}

export function applyPreset(data: Data, preset: Preset) {
  preset.removed?.forEach((field) => {
    if (field.flag === "header")
      data.header = removeField(data.header, field.name);
    if (field.flag === "detail")
      data.detail = removeField(data.detail, field.name);
    if (field.flag === "trailer")
      data.trailer = removeField(data.trailer, field.name);
  });

  preset.added?.forEach((item) => {
    if (item.flag === "header")
      data.header = addField(data.header, { [item.name]: item.value });
    if (item.flag === "detail")
      data.detail = addField(data.detail, { [item.name]: item.value });
    if (item.flag === "trailer")
      data.trailer = addField(data.trailer, { [item.name]: item.value });
  });

  preset.editedHeaders?.forEach((item) => {
    if (item.flag === "header")
      data.header = editHeader(data.header, { [item.name]: item.value });
    if (item.flag === "detail")
      data.detail = editHeader(data.detail, { [item.name]: item.value });
    if (item.flag === "trailer")
      data.trailer = editHeader(data.trailer, { [item.name]: item.value });
  });

  preset.functions?.forEach((item) => {
    if (item.resultField.flag === "header")
      data.header = runFunction(data.header, item);
    if (item.resultField.flag === "detail")
      data.detail = runFunction(data.detail, item);
    if (item.resultField.flag === "trailer")
      data.trailer = runFunction(data.trailer, item);
  });

  data.header = orderFields(data.header, preset.order.header);
  data.detail = orderFields(data.detail, preset.order.detail);
  data.trailer = orderFields(data.trailer, preset.order.trailer);

  data.name = setName(data.name, preset.schema);

  return data;
}
