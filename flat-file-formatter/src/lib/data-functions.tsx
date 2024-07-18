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

export function runFunction(
  data: Data,
  fn: Function,
): Record<string, unknown>[] {
  if (fn.operation === "conditional") {
    const evaluateCondition = (
      condition: any,
      record: Record<string, unknown>,
    ) => {
      const value = Number(record[condition.field.name]);
      switch (condition.comparison) {
        case "<":
          return !isNaN(value) && value < Number(condition.value);
        case ">":
          return !isNaN(value) && value > Number(condition.value);
        case "===":
          return record[condition.field.name] === condition.value;
        default:
          return false;
      }
    };

    return data.detail.map((record) => {
      const { conditions, result, valueTrue, valueFalse } = fn;

      const allConditionsPass = conditions.every((condition) => {
        const conditionPasses = evaluateCondition(condition, record);
        return condition.statement === "if"
          ? conditionPasses
          : !conditionPasses;
      });

      const finalValue = allConditionsPass ? valueTrue : valueFalse;
      const newValue = finalValue === "..." ? record[result.name] : finalValue;

      return { ...record, [result.name]: newValue };
    });
  }

  if (fn.operation === "equation") {
    return data.detail.map((record) => {
      const { formulas, result } = fn;

      let sum = 0;

      formulas.forEach((formula) => {
        const value = Number(record[formula.field.name]);
        if (!isNaN(value)) {
          // Check if value is a valid number
          if (formula.operator === "+") {
            sum += value;
          } else if (formula.operator === "-") {
            sum -= value;
          }
        }
      });

      // Assign the computed sum to the result field in the record
      return { ...record, [result.name]: sum };
    });
  }

  if (fn.operation === "total") {
  }

  return data.detail;
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

  preset.added?.forEach((field) => {
    if (field.flag === "header")
      data.header = addField(data.header, { [field.name]: field.value });
    if (field.flag === "detail")
      data.detail = addField(data.detail, { [field.name]: field.value });
    if (field.flag === "trailer")
      data.trailer = addField(data.trailer, { [field.name]: field.value });
  });

  preset.functions?.forEach((fn) => {
    if (fn.result.flag === "header") data.header = runFunction(data, fn);
    if (fn.result.flag === "detail") data.detail = runFunction(data, fn);
    if (fn.result.flag === "trailer") data.trailer = runFunction(data, fn);
  });

  data.header = orderFields(data.header, preset.order.header);
  data.detail = orderFields(data.detail, preset.order.detail);
  data.trailer = orderFields(data.trailer, preset.order.trailer);

  data.name = setName(data.name, preset.schema);

  return data;
}
