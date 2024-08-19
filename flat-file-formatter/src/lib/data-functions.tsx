import { extract, format, tokenize } from "@/lib/utils";
import { Changes, Data, Operation } from "@/types/schemas";

export function applyPattern(originalName: string, pattern = ""): string {
  if (!pattern) return originalName;
  const tokenized = tokenize(originalName);
  return pattern.replace(/{(\d+)}/g, (match: string, index: string) => {
    const tokenIndex = parseInt(index, 10);
    return tokenized[tokenIndex] ?? "";
  });
}

export function removeField(
  data: Record<string, string>[],
  field: string,
): Record<string, string>[] {
  return data.map((record) => {
    delete record[field];
    return record;
  });
}

export function addField(
  data: Record<string, string>[],
  name: string,
  value: string,
  after?: string,
): Record<string, string>[] {
  return data.map((record) => {
    const newRecord: Record<string, string> = {};
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
  data: Record<string, string>[],
  order: string[],
): Record<string, string>[] {
  return data.map((record) => {
    const reorderedRecord: Record<string, string> = {};
    order.forEach((field: string) => {
      if (field in record) {
        reorderedRecord[field] = record[field];
      }
    });
    return reorderedRecord;
  });
}

export function performOperation(data: Data, operation: Operation) {
  switch (operation.operation) {
    case "conditional":
      const evaluateCondition = (
        condition: any,
        record: Record<string, string>,
      ) => {
        const reference = condition.value.match(/\{[^}]*\}/)?.[0]?.slice(1, -1);
        const overpunch = condition.value
          .match(/\[\s*.*\|\s*.*\s*\]/)?.[0]
          ?.slice(1, -1)
          .split("|");

        const leftOP = overpunch?.[0] === "OP";
        const rightOP = overpunch?.[1] === "OP";

        const leftVal = leftOP
          ? extract(record[condition.field.name] as string)
          : record[condition.field.name];

        const rightVal = reference
          ? rightOP
            ? extract(record[reference] as string)
            : record[reference]
          : condition.value;

        switch (condition.comparison) {
          case "<":
            return Number(leftVal) < Number(rightVal);
          case ">":
            return Number(leftVal) > Number(rightVal);
          case "===":
            return leftVal === rightVal;
          default:
            return false;
        }
      };

      return data.records.detail.map((record: Record<string, string>) => {
        const { conditions, output, valueTrue, valueFalse } = operation;

        const allConditionsPass = conditions.every((condition) => {
          const conditionPasses = evaluateCondition(condition, record);
          return condition.statement === "if"
            ? conditionPasses
            : !conditionPasses;
        });

        const finalValue = allConditionsPass ? valueTrue : valueFalse;
        const newValue =
          finalValue === "..." ? record[output.name] : finalValue;

        return { ...record, [output.name]: newValue };
      });

    case "equation":
      return data.records.detail.map((record) => {
        const { formula, output } = operation;

        let sum = 0;

        formula.forEach((constant) => {
          const value = constant.overpunch
            ? Number(extract(record[constant.field.name] as string))
            : Number(record[constant.field.name]);
          if (!isNaN(value)) {
            // Check if value is a valid number
            if (constant.operator === "+") {
              sum += value;
            } else if (constant.operator === "-") {
              sum -= value;
            }
          }
        });

        // Assign the computed sum to the result field in the record
        return {
          ...record,
          [output.name]: operation.overpunch ? format(sum) : sum,
        };
      });

    default:
      return data;
  }
}

export function applyPreset(data: Data, changes: Changes) {
  changes.history?.forEach((change) => {
    switch (change.operation) {
      case "add":
      case "remove":
      case "conditional":
      case "equation":
      default:
        break;
    }
  });

  data.header = orderFields(data.header, changes.order.header);
  data.detail = orderFields(data.detail, changes.order.detail);
  data.trailer = orderFields(data.trailer, changes.order.trailer);

  data.name = applyPattern(data.name, changes.pattern);

  return data;
}
