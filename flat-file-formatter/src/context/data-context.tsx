"use client";
import { createContext, ReactNode, useReducer, useState } from "react";
import { Preset } from "@/types/preset";

interface DataContextProps {
  data: Record<string, unknown>[];
  name: string;
  setData: (data: Record<string, unknown>[]) => void;
  setName: (name: string) => void;
  removeField: (field: string) => void;
  addField: (field: Record<string, unknown>) => void;
  editValues: (field: Record<string, unknown>) => void;
  editHeader: (field: Record<string, unknown>) => void;
  orderFields: (order: string[]) => void;
  applyPreset: (preset: Preset) => void;
}

export const DataContext = createContext<DataContextProps>({
  data: [],
  name: "",
  setData: () => {},
  setName: () => {},
  removeField: () => {},
  addField: () => {},
  editValues: () => {},
  editHeader: () => {},
  orderFields: () => {},
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
    case "EDIT_VALUES":
      return state.map((row) => ({ ...row, ...action.field }));
    case "EDIT_HEADER":
      return state.map((row) => {
        const [field, value] = Object.entries(action.field)[0];
        if (field in row) {
          row[value as string] = row[field];
          delete row[field];
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
  const [name, setName] = useState<string>("data");
  const setData = (data: Record<string, unknown>[]) => {
    dispatch({ type: "SET_DATA", data: data });
  };
  const removeField = (field: string) => {
    dispatch({ type: "REMOVE_FIELD", field });
  };

  const addField = (field: Record<string, unknown>) => {
    dispatch({ type: "ADD_FIELD", field });
  };

  const editValues = (field: Record<string, unknown>) => {
    dispatch({ type: "EDIT_VALUES", field });
  };

  const editHeader = (field: Record<string, unknown>) => {
    dispatch({ type: "EDIT_HEADER", field });
  };

  const orderFields = (order: string[]) => {
    dispatch({ type: "ORDER_FIELDS", order });
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

    preset.editedValues?.forEach((item) => {
      editValues(item);
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
        editValues,
        editHeader,
        orderFields,
        applyPreset,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};
