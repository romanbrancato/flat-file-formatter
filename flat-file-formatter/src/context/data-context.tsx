"use client";
import {createContext, ReactNode, useReducer, useState} from "react";
import {Preset} from "@/types/preset";

interface DataContextProps {
  data: Record<string, unknown>[];
  name: string;
  setData: (data: Record<string, unknown>[]) => void;
  setName: (name: string) => void;
  removeField: (field: string) => void;
  addField: (name: string, value: string) => void;
  editField: (field: string, value: string) => void;
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
  editField: () => {},
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
      return state.map((row) => ({ ...row, [action.name]: action.value }));
    case "EDIT_FIELD":
      return state.map((row) => {
        row[action.field] = action.value;
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

  const addField = (name: string, value: string) => {
    dispatch({ type: "ADD_FIELD", name, value });
  };

  const editField = (field: string, value: string) => {
    dispatch({ type: "EDIT_FIELD", field, value });
  };

  const orderFields = (order: string[]) => {
    dispatch({ type: "ORDER_FIELDS", order });
  };

  const applyPreset = (preset: Preset) => {
    preset.removed?.forEach((field) => {
      removeField(field);
    });

    preset.added?.forEach(({ field, value }) => {
      addField(field, value);
    });

    preset.edited?.forEach(({ field, value }) => {
      editField(field, value);
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
        editField,
        orderFields,
        applyPreset
      }}
    >
      {children}
    </DataContext.Provider>
  );
};
