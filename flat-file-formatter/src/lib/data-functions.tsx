import { evaluateCondition, extract, tokenize } from "@/lib/utils";
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
  const { field, batch } = operation;
  const updatedRecord = data.records[field.flag].map((record) => {
    if (batch) {
      const keys = Object.keys(record);
      const startIndex = keys.indexOf(field.name);
      if (startIndex !== -1) {
        keys.slice(startIndex).forEach((key) => {
          delete record[key];
        });
      }
    } else {
      delete record[field.name];
    }
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
        newRecord[name] =
          value.startsWith("{") && value.endsWith("}")
            ? record[value.slice(1, -1).trim()]
            : value;
        inserted = true;
      }
    });

    if (!inserted) {
      newRecord[name] =
        value.startsWith("{") && value.endsWith("}")
          ? record[value.slice(1, -1).trim()]
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

    switch (action.action) {
      case "setValue":
        updatedRecords.detail.push({
          ...record,
          [action.field.name]: (() => {
            if (action.value.startsWith("{") && action.value.endsWith("}")) {
              const key = action.value.slice(1, -1).trim();
              return record[key];
            } else {
              return action.value;
            }
          })(),
        });
        break;

      case "separate":
        if (!updatedRecords[action.tag]) updatedRecords[action.tag] = [];
        updatedRecords[action.tag].push(record);
        break;

      case "duplicate":
        const firstRecord = { ...record };
        const secondRecord = { ...record };
        action.firstRecord.forEach((field) => {
          firstRecord[field.field.name] = field.value;
        });
        action.secondRecord.forEach((field) => {
          secondRecord[field.field.name] = field.value;
        });
        updatedRecords.detail.push(firstRecord, secondRecord);
        break;
      case "nothing":
        updatedRecords.detail.push(record);
        break;
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

  const { fields, reformat } = operation;

  const updatedRecord = data.records.detail.map((record) => {
    let updatedFields = { ...record };

    fields.forEach((field) => {
      switch (reformat.type) {
        case "date":
          updatedFields[field.name] = format(
            new Date(record[field.name] as string),
            reformat.pattern,
          );
          break;
        case "number":
          switch (reformat.from) {
            case "scientific":
              updatedFields[field.name] = Number(record[field.name]).toString();
              break;
            case "overpunch":
              updatedFields[field.name] = Number(
                extract(record[field.name]),
              ).toString();
              break;
          }
          break;
      }
    });

    return updatedFields;
  });

  return {
    ...data,
    records: {
      ...data.records,
      detail: updatedRecord,
    },
  };
}

export function applyPreset(data: Data, changes: Changes): Data {
  changes.history?.forEach((change) => {
    switch (change.operation) {
      case "add":
        data = addField(data, change);
        break;
      case "remove":
        data = removeField(data, change);
        break;
      case "conditional":
        data = evaluateConditions(data, change);
        break;
      case "equation":
        data = evaluateEquation(data, change);
        break;
      case "reformat":
        data = reformatData(data, change);
        break;
    }
  });
  data = orderFields(data, "header", changes.order.header);
  data = orderFields(data, "detail", changes.order.detail);
  data = orderFields(data, "trailer", changes.order.trailer);

  data.name = applyPattern(data.name, changes.pattern);

  return data;
}
