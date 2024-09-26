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

export function removeFields(data: Data, operation: Operation): Data {
  if (operation.operation !== "remove") return data;

  const { fields } = operation;

  fields.forEach(({ name, tag }) => {
    const records = data.records[tag];
    if (!records) return;

    const fieldIndex = records.fields.indexOf(name);
    if (fieldIndex === -1) return;

    records.fields.splice(fieldIndex, 1);
    records.rows.forEach((row) => row.splice(fieldIndex, 1));
  });

  return { ...data, records: { ...data.records } };
}

export function addFields(data: Data, operation: Operation): Data {
  if (operation.operation !== "add") return data;

  const { tag, fields, after } = operation;
  const records = data.records[tag];
  if (!records) return data;

  let insertIndex = after
    ? records.fields.findIndex((field) => field === after.name) + 1
    : 0;

  fields.forEach(({ name, value }) => {
    const resolvedValue =
      value.startsWith("{") && value.endsWith("}")
        ? records.rows.map((row) => {
            const refIndex = records.fields.indexOf(value.slice(1, -1).trim());
            return refIndex !== -1 ? row[refIndex] : value;
          })
        : Array(records.rows.length).fill(value);

    records.fields.splice(insertIndex, 0, name);
    records.rows.forEach((row, rowIndex) => {
      row.splice(insertIndex, 0, resolvedValue[rowIndex]);
    });
    insertIndex++;
  });

  return { ...data, records: { ...data.records } };
}

export function orderFields(data: Data, tag: string, order: number[]): Data {
  const record = data.records[tag];
  if (!record) return data;

  record.fields = order.map((index) => record.fields[index]);
  record.rows = record.rows.map((row) => order.map((index) => row[index]));

  return { ...data, records: { ...data.records } };
}

export function evaluateConditions(data: Data, operation: Operation): Data {
  if (operation.operation !== "conditional") return data;

  const { tag, conditions, actionTrue, actionFalse } = operation;
  const records = data.records[tag];

  records.rows = records.rows.flatMap((row) => {
    const action = conditions.every((condition) =>
      evaluateCondition(records.fields, row, condition),
    )
      ? actionTrue
      : actionFalse;

    switch (action.action) {
      case "setValue":
        action.values.forEach(({ field, value }) => {
          const refIndex = records.fields.indexOf(
            value.startsWith("{") && value.endsWith("}")
              ? value.slice(1, -1).trim()
              : value,
          );
          row[records.fields.indexOf(field.name)] =
            refIndex !== -1 ? row[refIndex] : value;
        });
        return [row];

      case "separate":
        if (!data.records[action.tag])
          data.records[action.tag] = { fields: records.fields, rows: [] };
        data.records[action.tag].rows.push(row);
        return [];

      case "duplicate":
        const duplicate = [...row];
        action.rowOriginal.forEach((field) => {
          row[records.fields.indexOf(field.field.name)] = field.value;
        });
        action.rowDuplicate.forEach((field) => {
          duplicate[records.fields.indexOf(field.field.name)] = field.value;
        });
        return [row, duplicate];

      case "nothing":
        return [row];
    }
  });

  return { ...data, records: { ...data.records } };
}

export function evaluateEquation(data: Data, operation: Operation): Data {
  if (operation.operation !== "equation") return data;

  const { tag, direction, equation, output } = operation;
  const records = data.records[tag];

  if (!records) return data;

  const computeTotal = (row: string[]): number => {
    return equation.reduce((total, item) => {
      const value = Number(row[records.fields.indexOf(item.field.name)]);
      return !isNaN(value)
        ? item.operator === "+"
          ? total + value
          : total - value
        : total;
    }, 0);
  };

  if (direction === "column") {
    const total = records.rows.reduce((acc, row) => acc + computeTotal(row), 0);
    records.rows.forEach((row) => {
      row[records.fields.indexOf(output.name)] = total.toString();
    });
  } else if (direction === "row") {
    records.rows = records.rows.map((row) => {
      const total = computeTotal(row);
      row[records.fields.indexOf(output.name)] = total.toString();
      return row;
    });
  }

  return { ...data, records: { ...data.records } };
}

export function reformatData(data: Data, operation: Operation): Data {
  if (operation.operation !== "reformat") return data;

  const { tag, fields, reformat } = operation;
  const records = data.records[tag];
  if (!records) return data;

  records.rows = records.rows.map((row) => {
    fields.forEach((field) => {
      const fieldIndex = records.fields.indexOf(field.name);
      if (fieldIndex === -1) return;

      switch (reformat.type) {
        case "date":
          row[fieldIndex] = format(new Date(row[fieldIndex]), reformat.pattern);
          break;
        case "number":
          switch (reformat.from) {
            case "scientific":
              row[fieldIndex] = Number(row[fieldIndex]).toString();
              break;
            case "overpunch":
              row[fieldIndex] = Number(extract(row[fieldIndex])).toString();
              break;
          }
          break;
      }
    });

    return row;
  });

  return { ...data, records: { ...data.records } };
}

export function applyPreset(data: Data, changes: Changes): Data {
  changes.history?.forEach((change) => {
    switch (change.operation) {
      case "add":
        addFields(data, change);
        break;
      case "remove":
        removeFields(data, change);
        break;
      case "conditional":
        evaluateConditions(data, change);
        break;
      case "equation":
        evaluateEquation(data, change);
        break;
      case "reformat":
        reformatData(data, change);
        break;
    }
  });

  Object.keys(data.records).forEach((tag) => {
    const orderIndices = changes.order?.[tag]?.map((field) =>
      data.records[tag].fields.indexOf(field),
    );
    if (orderIndices) {
      orderFields(data, tag, orderIndices);
    }
  });

  data.name = applyPattern(data.name, changes.pattern);

  return { ...data };
}
