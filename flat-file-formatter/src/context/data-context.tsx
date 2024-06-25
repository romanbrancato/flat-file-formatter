"use client";
import { createContext, ReactNode, useReducer, useState } from "react";
import {Func, Preset} from "@/types/preset";
import { tokenize } from "@/lib/utils";

interface DataContextProps {
  data: Record<string, unknown>[];
  name: string;
  setData: (data: Record<string, unknown>[]) => void;
  setName: (name: string) => void;
  removeField: (field: string) => void;
  addField: (field: Record<string, unknown>) => void;
  runFunction: (func: Func) => void;
  editHeader: (field: Record<string, unknown>) => void;
  orderFields: (order: string[]) => void;
  applySchema: (schema: string) => void;
  applyPreset: (preset: Preset) => void;
}

export const DataContext = createContext<DataContextProps>({
  data: [],
  name: "",
  setData: () => {},
  setName: () => {},
  removeField: () => {},
  addField: () => {},
  runFunction: () => {},
  editHeader: () => {},
  orderFields: () => {},
  applySchema: () => {},
  applyPreset: () => {},
});

interface DataProviderProps {
  children: ReactNode;
}

const dataReducer = (state: Record<string, unknown>[], action: any) => {
  switch (action.type) {
    case "SET_DATA":
      return action.data;
    case "SET_NAME":
      return { ...state, name: action.name };
    case "REMOVE_FIELD":
      return state.map((row) => {
        delete row[action.field];
        return row;
      });
    case "ADD_FIELD":
      return state.map((row) => ({ ...row, ...action.field }));
    case "RUN_FUNCTION":
      const { field, func, condition, then, valueTrue, valueFalse } = action.func;
      return state.map((row) => {
        if (row[field] !== undefined) {
          const conditionPassed = condition === "" || (func === "if"
              ? row[field] === condition
              : row[field] !== condition);

          if (conditionPassed) {
            return { ...row, [then]: valueTrue };
          } else {
            return { ...row, [then]: valueFalse };
          }
        }
        return row;
      });

    case "EDIT_HEADER":
      return state.map((row) => {
        const [field, value] = Object.entries(action.field)[0];
        if (field in row) {
          return {
            ...Object.fromEntries(
              Object.entries(row).map(([key, val]) =>
                key === field ? [value, val] : [key, val],
              ),
            ),
          };
        }
        return row;
      });
    case "ORDER_FIELDS":
      return state.map((record) => {
        const reorderedRecord: Record<string, unknown> = {};
        action.order.forEach((field: string) => {
          if (field in record) {
            reorderedRecord[field] = record[field];
          }
        });
        return reorderedRecord;
      });
    default:
      return state;
  }
};

export const DataContextProvider = ({ children }: DataProviderProps) => {
  const [data, dispatch] = useReducer(dataReducer, []);
  const [name, setName] = useState<string>("");
  const setData = (data: Record<string, unknown>[]) => {
    dispatch({ type: "SET_DATA", data: data });
  };
  const removeField = (field: string) => {
    dispatch({ type: "REMOVE_FIELD", field });
  };

  const addField = (field: Record<string, unknown>) => {
    dispatch({ type: "ADD_FIELD", field });
  };

  const runFunction = (func: Func) => {
    dispatch({ type: "RUN_FUNCTION", func});
  }

  const editHeader = (field: Record<string, unknown>) => {
    dispatch({ type: "EDIT_HEADER", field });
  };

  const orderFields = (order: string[]) => {
    dispatch({ type: "ORDER_FIELDS", order });
  };

  const applySchema = (schema: string) => {
    if (!schema) return;
    const tokenized = tokenize(name);
    setName(
      schema.replace(/{(\d+)}/g, (match: string, index: string) => {
        const tokenIndex = parseInt(index, 10);
        return tokenized[tokenIndex] ?? "";
      }),
    );
  };

  const applyPreset = (preset: Preset) => {
    preset.removed?.forEach((field) => {
      removeField(field);
    });

    preset.added?.forEach((item) => {
      addField(item);
    });

    preset.editedHeaders?.forEach((item) => {
      editHeader(item);
    });

    preset.functions?.forEach((item) => {
      runFunction(item);
    });

    orderFields(preset.order);
  };

  return (
    <DataContext.Provider
      value={{
        data,
        name,
        setData,
        setName,
        removeField,
        addField,
        runFunction,
        editHeader,
        orderFields,
        applySchema,
        applyPreset,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};
