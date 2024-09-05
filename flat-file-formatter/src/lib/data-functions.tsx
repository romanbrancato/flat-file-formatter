import { evaluateCondition, tokenize } from "@/lib/utils";
import { Changes, Data, Operation } from "@/types/schemas";
import { format } from "date-fns";

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
  let updatedRecords: { [key: string]: any } = { ...data.records, detail: [] };

  data.records.detail.forEach((record) => {
    const allConditionsPass = conditions.every((condition) =>
      evaluateCondition(record, condition),
    );
    const action = allConditionsPass ? actionTrue : actionFalse;

    if (action.action === "setValue") {
      updatedRecords.detail.push({
        ...record,
        [action.field.name]:
          action.value === "..." ? record[action.field.name] : action.value,
      });
    } else if (action.action === "separate") {
      if (!updatedRecords[action.tag]) updatedRecords[action.tag] = [];
      updatedRecords[action.tag].push(record);
    }
  });

  return { ...data, records: updatedRecords };
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

export function reformatData(data: Data, operation: Operation): Data {
  if (operation.operation !== "reformat") return data;
  const { details, field } = operation;
  switch (details.type) {
    case "date":
      data.records[field.flag].map((record) => ({
        ...record,
        [field.name]: format(
          new Date(record[field.name] as string),
          details.type === "date" ? details.pattern : "",
        ),
      }));
      break;
    case "number":
      data.records[field.flag].map((record) => ({
        ...record,
        [field.name]: Number(record[field.name]),
      }));
      break;
    default:
      break;
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
