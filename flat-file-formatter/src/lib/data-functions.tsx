import { Function, Preset } from "@/context/preset-context";
import { extractOverpunch, formatOverpunch, tokenize } from "@/lib/utils";
import { Data } from "@/lib/parser-functions";
import { format } from "date-fns";

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
  name: string,
  value: string,
  after?: string,
): Record<string, unknown>[] {
  return data.map((record) => {
    const newRecord: Record<string, unknown> = {};
    let inserted = false;

    Object.entries(record).forEach(([key, val], index) => {
      newRecord[key] = val;
      if (after && key === after && !inserted) {
        newRecord[name] = value.startsWith("...")
          ? record[value.slice(3)]
          : value;
        inserted = true;
      }
    });

    if (!inserted) {
      newRecord[name] = value.startsWith("...")
        ? record[value.slice(3)]
        : value;
    }

    return newRecord;
  });
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
      const value = condition.overpunch
        ? Number(extractOverpunch(record[condition.field.name] as string))
        : Number(record[condition.field.name]);

      let comparisonValue = condition.value;
      const referenceMatch = comparisonValue.match(/^{(.+)}$/);
      if (referenceMatch) {
        comparisonValue = referenceMatch[1].endsWith("{OP}")
          ? extractOverpunch(record[referenceMatch[1].slice(0, -4)] as string)
          : record[referenceMatch[1]];
      }

      switch (condition.comparison) {
        case "<":
          return !isNaN(value) && value < Number(comparisonValue);
        case ">":
          return !isNaN(value) && value > Number(comparisonValue);
        case "===":
          return record[condition.field.name] === comparisonValue;
        default:
          return false;
      }
    };

    return data.detail.map((record) => {
      const { conditions, output, valueTrue, valueFalse } = fn;

      const allConditionsPass = conditions.every((condition) => {
        const conditionPasses = evaluateCondition(condition, record);
        return condition.statement === "if"
          ? conditionPasses
          : !conditionPasses;
      });

      const finalValue = allConditionsPass ? valueTrue : valueFalse;
      const newValue = finalValue === "..." ? record[output.name] : finalValue;

      return { ...record, [output.name]: newValue };
    });
  }

  if (fn.operation === "equation") {
    return data.detail.map((record) => {
      const { formulas, output } = fn;

      let sum = 0;

      formulas.forEach((formula) => {
        const value = formula.overpunch
          ? Number(extractOverpunch(record[formula.field.name] as string))
          : Number(record[formula.field.name]);
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
      return {
        ...record,
        [output.name]: fn.overpunch ? formatOverpunch(sum) : sum,
      };
    });
  }

  if (fn.operation === "total") {
    let total = fn.fields.reduce((acc, field) => {
      return (
        acc +
        data[field.field.flag]
          .flatMap((record) =>
            field.overpunch
              ? Number(extractOverpunch(record[field.field.name] as string))
              : Number(record[field.field.name]) || 0,
          )
          .reduce((sum, value) => sum + value, 0)
      );
    }, 0);

    return data[fn.output.flag].map((record) => ({
      ...record,
      [fn.output.name]: fn.overpunch ? formatOverpunch(total) : total,
    }));
  }

  if (fn.operation === "format") {
    return data[fn.output.flag].map((record) => ({
      ...record,
      [fn.output.name]: format(
        new Date(record[fn.output.name] as string),
        fn.pattern,
      ),
    }));
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
      data.header = addField(data.header, field.name, field.value);
    if (field.flag === "detail")
      data.detail = addField(data.detail, field.name, field.value);
    if (field.flag === "trailer")
      data.trailer = addField(data.trailer, field.name, field.value);
  });

  preset.functions?.forEach((fn) => {
    if (fn.output.flag === "header") data.header = runFunction(data, fn);
    if (fn.output.flag === "detail") data.detail = runFunction(data, fn);
    if (fn.output.flag === "trailer") data.trailer = runFunction(data, fn);
  });

  data.header = orderFields(data.header, preset.order.header);
  data.detail = orderFields(data.detail, preset.order.detail);
  data.trailer = orderFields(data.trailer, preset.order.trailer);

  data.name = setName(data.name, preset.schema);

  return data;
}
