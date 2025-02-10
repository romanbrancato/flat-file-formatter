import { fromOverpunch, interpretValue } from "./utils";
import {Data, Operation } from "../types/schemas";
import dayjs from "dayjs";

export function handleRemove(data: Data, operation: Operation): Data {
  if (operation.operation !== "remove") return data;

  for (const { name, tag } of operation.fields) {
    const records = data[tag];
    if (!records) continue;

    const index = records.fields.indexOf(name);
    if (index === -1) continue;

    records.fields.splice(index, 1);
    records.rows.forEach(row => row.splice(index, 1));
  }

  for (const tag in data) {
    if (!data[tag].fields.length) delete data[tag];
  }

  return { ...data };
}

export function handleAdd(data: Data, operation: Operation): Data {
  if (operation.operation !== "add" || !data[operation.tag]) return data;

  const { tag, fields, after } = operation;
  const { fields: header, rows } = data[tag];
  let insertAt = after ? header.indexOf(after.name) + 1 : 0;

  for (const { name, value } of fields) {
    rows.forEach(row => row.splice(insertAt, 0, interpretValue(row, header, value)));
    header.splice(insertAt++, 0, name);
  }

  return { ...data };
}

export function handleConditional(data: Data, operation: Operation): Data {
  if (operation.operation !== "conditional") return data;

  const { tag, conditions, actionTrue, actionFalse } = operation;
  const records = data[tag];

  // Ensure required tags exist for separate actions
  [actionTrue, actionFalse].forEach(action => {
    if (action.action === "separate" && !data[action.tag]) {
      data[action.tag] = { fields: [...records.fields], rows: [] };
    }
  });

  const evaluate = (row: string[], condition: any): boolean => {
    const leftVal = row[records.fields.indexOf(condition.field.name)];
    const rightVal = interpretValue(row, records.fields, condition.value);

    const passes =
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

    return condition.statement === "if not" ? !passes : passes;
  };

  records.rows = records.rows.flatMap(row => {
    const action = conditions.every(c => evaluate(row, c)) ? actionTrue : actionFalse;

    switch (action.action) {
      case "set value":
        action.values.forEach(({ field, value }) => {
          row[records.fields.indexOf(field.name)] = interpretValue(row, records.fields, value);
        });
        return [row];

      case "separate":
        data[action.tag].rows.push(row);
        return [];

      case "duplicate": {
        const duplicate = [...row];
        action.rowOriginal.forEach(({ field, value }) =>
            row[records.fields.indexOf(field.name)] = value);
        action.rowDuplicate.forEach(({ field, value }) =>
            duplicate[records.fields.indexOf(field.name)] = value);
        return [row, duplicate];
      }

      default: // "nothing" and unknown actions
        return [row];
    }
  });

  return { ...data };
}

export function handleEquation(data: Data, operation: Operation): Data {
  if (operation.operation !== "equation" || !data[operation.tag]) return data;

  const { tag, direction, equation, output } = operation;
  const { fields, rows } = data[tag];
  const outputIndex = fields.indexOf(output.name);

  const computeTotal = (row: string[]) => equation.reduce((total, { field, operator }) => {
    const value = Number(row[fields.indexOf(field.name)]);
    return isNaN(value) ? total : operator === "+" ? total + value : total - value;
  }, 0);

  const total = direction === "column"
      ? rows.reduce((sum, row) => sum + computeTotal(row), 0)
      : null;

  data[tag].rows = rows.map(row => {
    row[outputIndex] = (total ?? computeTotal(row)).toString();
    return row;
  });

  return { ...data };
}

export function handleReformat(data: Data, operation: Operation): Data {
  if (operation.operation !== "reformat" || !data[operation.tag]) return data;

  const { tag, fields, reformat } = operation;
  const { fields: headers, rows } = data[tag];
  const reformatters = {
    date: (v: string) => dayjs(v).format(reformat.pattern),
    number: (v: string) =>
        (reformat.type=="number" && reformat.overpunch ? Number(fromOverpunch(v)) : Number(v)).toString()
  };

  rows.forEach(row => {
    for (const field of fields) {
      const idx = headers.indexOf(field.name);
      if (idx === -1 || !row[idx]) continue;

      row[idx] = reformatters[reformat.type](row[idx]);
    }
  });

  return { ...data };
}

export function handlePreset(data: Data, changes: Operation[]): Data {
  const handlers = {
    add: handleAdd,
    remove: handleRemove,
    conditional: handleConditional,
    equation: handleEquation,
    reformat: handleReformat
  } as const;

  changes.forEach(change => handlers[change.operation]?.(data, change));
  return { ...data };
}
