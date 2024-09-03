import { extract, format, tokenize } from "@/lib/utils";
import { Action, Changes, Data, Field, Operation } from "@/types/schemas";

export function applyPattern(originalName: string, pattern = ""): string {
  if (!pattern) return originalName;
  const tokenized = tokenize(originalName);
  return pattern.replace(/{(\d+)}/g, (match: string, index: string) => {
    const tokenIndex = parseInt(index, 10);
    return tokenized[tokenIndex] ?? "";
  });
}

export function removeField(data: Data, operation: Operation): Data {
  if (operation.operation !== "remove") return data;
  const { field } = operation;
  const updatedRecord = data.records[field.flag].map((record) => {
    delete record[field.name];
    return record;
  });
  return { ...data, records: { ...data.records, [field.flag]: updatedRecord } };
}

export function addField(data: Data, operation: Operation): Data {
  if (operation.operation !== "add") return data;
  const { flag, name, value, after } = operation;
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

export function orderFields(data: Data, tag: string, order: string[]): Data {
  const updatedRecord = data.records[tag].map((record) => {
    const reorderedRecord: Record<string, string> = {};
    order.forEach((field: string) => {
      if (field in record) {
        reorderedRecord[field] = record[field];
      }
    });
    return reorderedRecord;
  });
  return { ...data, records: { ...data.records, [tag]: updatedRecord } };
}

export function evaluateConditions(data: Data, operation: Operation): Data {
  if (operation.operation !== "conditional") return data;

  const { conditions, actionTrue, actionFalse } = operation;
  const passingIndexes: number[] = [];
  const failingIndexes: number[] = [];

  data.records.detail.forEach((record, index) => {
    let allConditionsPass = true;

    for (const condition of conditions) {
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

      let conditionPasses = false;

      switch (condition.comparison) {
        case "<":
          conditionPasses = Number(leftVal) < Number(rightVal);
          break;
        case ">":
          conditionPasses = Number(leftVal) > Number(rightVal);
          break;
        case "===":
          conditionPasses = leftVal === rightVal;
          break;
        default:
          conditionPasses = false;
      }

      // Adjust conditionPasses based on the condition.statement
      if (condition.statement === "if not") {
        conditionPasses = !conditionPasses;
      }

      if (!conditionPasses) {
        allConditionsPass = false;
        break;
      }
    }

    if (allConditionsPass) {
      passingIndexes.push(index);
    } else {
      failingIndexes.push(index);
    }
  });

  const applyActions = (indexes: number[], action: Action) => {
    indexes.forEach((index) => {
      if (action.action === "setValue") {
        data.records.detail[index] = {
          ...data.records.detail[index],
          [action.field.name]:
            action.value === "..."
              ? data.records.detail[index][action.field.name]
              : action.value,
        };
      }
      if (action.action === "separate") {
        data.records[action.tag].push(data.records.detail[index]);
        delete data.records.detail[index];
      }
    });
  };

  applyActions(passingIndexes, actionTrue);
  applyActions(failingIndexes, actionFalse);

  return data;
}

export function evaluateEquation(data: Data, operation: Operation): Data {
  if (operation.operation !== "equation") return data;
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
        [output.flag]: data.records[output.flag].map((record) => ({
          ...record,
          [output.name]: total.toString(),
        })),
      },
    };
  }

  if (direction === "row") {
    const updatedRecord = data.records.detail.map((record) => {
      let total = 0;

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

      return {
        ...record,
        [output.name]: total.toString(),
      };
    });

    return {
      ...data,
      records: {
        ...data.records,
        detail: updatedRecord,
      },
    };
  }

  return data;
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
