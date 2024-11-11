import { fromOverpunch, interpretValue } from "@/lib/utils";
import { Action, Changes, Data, Operation } from "@/types/schemas";
import numeral from "numeral";
import dayjs from "dayjs";

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

  return { ...data };
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
    records.rows.forEach((row) => {
      row.splice(insertIndex, 0, interpretValue(row, records.fields, value));
    });
    records.fields.splice(insertIndex, 0, name);
    insertIndex++;
  });

  return { ...data };
}

export function orderFields(data: Data, tag: string, order: number[]): Data {
  const record = data.records[tag];
  if (!record) return data;

  record.fields = order.map((index) => record.fields[index]);
  record.rows = record.rows.map((row) => order.map((index) => row[index]));

  return { ...data };
}

export function evaluateConditions(data: Data, operation: Operation): Data {
  if (operation.operation !== "conditional") return data;

  const { tag, conditions, actionTrue, actionFalse } = operation;
  const records = data.records[tag];

  function evaluateCondition(
    fields: string[],
    row: string[],
    condition: any,
  ): boolean {
    const leftVal = row[fields.indexOf(condition.field.name)];
    const rightVal = interpretValue(row, fields, condition.value);

    const conditionPasses =
      (() => {
        switch (condition.comparison) {
          case "<":
            return Number(leftVal) < Number(rightVal);
          case ">":
            return Number(leftVal) > Number(rightVal);
          case "=":
            return leftVal === rightVal;
          case "<=":
            return Number(leftVal) <= Number(rightVal);
          case ">=":
            return Number(leftVal) >= Number(rightVal);
        }
      })() || false;

    return condition.statement === "if not"
      ? !conditionPasses
      : conditionPasses;
  }

  // Ensures that any additional tags are created even if no rows end up being pushed to them.
  const createTag = (action: Action) => {
    if (action.action === "separate" && !data.records[action.tag]) {
      data.records[action.tag] = { fields: [...records.fields], rows: [] };
    }
  };

  createTag(actionTrue);
  createTag(actionFalse);

  records.rows = records.rows.flatMap((row) => {
    const action = conditions.every((condition) =>
      evaluateCondition(records.fields, row, condition),
    )
      ? actionTrue
      : actionFalse;

    switch (action.action) {
      case "setValue":
        action.values.forEach(({ field, value }) => {
          row[records.fields.indexOf(field.name)] = interpretValue(
            row,
            records.fields,
            value,
          );
        });
        return [row];

      case "separate":
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

  return { ...data };
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

  return { ...data };
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
          row[fieldIndex] = dayjs(row[fieldIndex]).format(reformat.pattern);
          break;
        case "number":
          let numStr = reformat.overpunch
            ? Number(fromOverpunch(row[fieldIndex])).toString()
            : Number(row[fieldIndex]).toString();
          if (reformat.pattern) {
            numStr = numeral(numStr).format(reformat.pattern);
          }
          row[fieldIndex] = numStr;
          break;
      }
    });

    return row;
  });

  return { ...data };
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

  return { ...data };
}
