"use client";
import { createContext, ReactNode, useReducer } from "react";

interface DataContextProps {
  data: Record<string, unknown>[];
  setData: (data: Record<string, unknown>[]) => void;
  removeField: (field: string) => void;
  addField: (name: string, value: string) => void;
  editField: (field: string, value: string) => void;
  orderFields: (order: string[]) => void;
}

export const DataContext = createContext<DataContextProps>({
  data: [],
  setData: () => {},
  removeField: () => {},
  addField: () => {},
  editField: () => {},
  orderFields: () => {},
});

interface DataProviderProps {
  children: ReactNode;
}

const dataReducer = (state: Record<string, unknown>[], action: any) => {
  switch (action.type) {
    case "SET_DATA":
      return action.data;
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
  const [data, dispatchData] = useReducer(dataReducer, []);

  const setData = (data: Record<string, unknown>[]) => {
    dispatchData({ type: "SET_DATA", data: data });
  };

  const removeField = (field: string) => {
    dispatchData({ type: "REMOVE_FIELD", field });
  };

  const addField = (name: string, value: string) => {
    dispatchData({ type: "ADD_FIELD", name, value });
  };

  const editField = (field: string, value: string) => {
    dispatchData({ type: "EDIT_FIELD", field, value });
  };

  const orderFields = (order: string[]) => {
    dispatchData({ type: "ORDER_FIELDS", order });
  };

  return (
    <DataContext.Provider
      value={{
        data,
        setData,
        removeField,
        addField,
        editField,
        orderFields,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};
