import { extract, format, tokenize } from "@/lib/utils";
import { Changes, Data, Field, Operation } from "@/types/schemas";

export function applyPattern(originalName: string, pattern = ""): string {
  if (!pattern) return originalName;
  const tokenized = tokenize(originalName);
  return pattern.replace(/{(\d+)}/g, (match: string, index: string) => {
    const tokenIndex = parseInt(index, 10);
    return tokenized[tokenIndex] ?? "";
  });
}

export function removeField(data: Data, field: Field): Data {
  const updatedRecord = data.records[field.flag].map((record) => {
    delete record[field.name];
    return record;
  });
  return { ...data, records: { ...data.records, [field.flag]: updatedRecord } };
}

export function addField(
  data: Data,
  flag: "header" | "detail" | "trailer",
  name: string,
  value: string,
  after?: Field,
): Data {
  const updatedRecord = data.records[flag].map((record) => {
    const newRecord: Record<string, string> = {};
    let inserted = false;

    Object.entries(record).forEach(([key, val], index) => {
      newRecord[key] = val;
      if (after && key === after.name && !inserted) {
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

  return { ...data, records: { ...data.records, [flag]: updatedRecord } };
}

export function orderFields(
  data: Data,
  flag: "header" | "detail" | "trailer",
  order: string[],
): Data {
  const updatedRecord = data.records[flag].map((record) => {
    const reorderedRecord: Record<string, string> = {};
    order.forEach((field: string) => {
      if (field in record) {
        reorderedRecord[field] = record[field];
      }
    });
    return reorderedRecord;
  });
  return { ...data, records: { ...data.records, [flag]: updatedRecord } };
}

export function performOperation(data: Data, operation: Operation): Data {
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

      const newRecords = data.records.detail.map(
        (record: Record<string, string>) => {
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
        },
      );

      return { ...data, records: { ...data.records, detail: newRecords } };

    case "equation":
      const { direction, formula, output } = operation;

      if (direction === "column") {
        let total = 0;

        data.records.detail.forEach((record) => {
          formula.forEach((item) => {
            const value = Number(record[item.field.name]);
            if (!isNaN(value)) {
              if (item.operator === "+") {
                total += value;
              } else if (item.operator === "-") {
                total -= value;
              }
            }
          });
        });

        return {
          ...data,
          records: {
            ...data.records,
            [output.flag]: {
              ...data.records[output.flag],
              [output.name]: total,
            },
          },
        };
      }
    default:
      return data;
  }
}

export function applyPreset(data: Data, changes: Changes): Data {
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
