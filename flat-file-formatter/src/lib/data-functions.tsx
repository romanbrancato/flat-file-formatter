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

export function runFunction(data: Data, fn: Function): Data {
  if (fn.operation === "conditional") {
    data[fn.flag];
    for (const condition of fn.conditions) {
      const { statement, field, comparison, value } = condition;

      const result = eval(
        `${data[field.flag][field.name]} ${comparison} ${value}`,
      );

      if (
        (statement === "if" && result) ||
        (statement === "if not" && !result)
      ) {
        data[fn.result.flag].push({ [fn.result.name]: fn.valueTrue });
      } else {
        data[fn.result.flag].push({ [fn.result.name]: fn.valueFalse });
      }
    }
  }

  return data;
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

  // ADD RUN FUNCTION HERE

  data.header = orderFields(data.header, preset.order.header);
  data.detail = orderFields(data.detail, preset.order.detail);
  data.trailer = orderFields(data.trailer, preset.order.trailer);

  data.name = setName(data.name, preset.schema);

  return data;
}
