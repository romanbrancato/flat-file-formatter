"use client";
import {
  createContext,
  ReactNode,
  useEffect,
  useReducer,
  useState,
} from "react";
import { Preset } from "@/types/preset";

interface DataContextProps {
  data: Record<string, unknown>[];
  preset: Preset;
  setData: (data: Record<string, unknown>[]) => void;
  addField: (name: string, value: string) => void;
  removeField: (field: string) => void;
  editField: (field: string, value: string) => void;
  arrangeFields: (order: string[]) => void;
  loadPreset: (preset: Preset) => void;
  savePreset: (name: string) => void;
  exportPreset: () => void;
}

export const DataContext = createContext<DataContextProps>({
  data: [],
  preset: {} as Preset,
  setData: () => {},
  addField: () => {},
  removeField: () => {},
  editField: () => {},
  arrangeFields: () => {},
  loadPreset: () => {},
  savePreset: () => {},
  exportPreset: () => {},
});

interface DataProviderProps {
  children: ReactNode;
}

const dataReducer = (state: Record<string, unknown>[], action: any) => {
  switch (action.type) {
    case "SET_DATA":
      return action.data;
    case "ADD_FIELD":
      return state.map((row) => ({ ...row, [action.name]: action.value }));
    case "REMOVE_FIELD":
      return state.map((row) => {
        delete row[action.field];
        return row;
      });
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

const presetReducer = (state: Preset, action: any): Preset => {
  switch (action.type) {
    case "SET_NAME":
      return { ...state, name: action.name };
    case "ADD_FIELD":
      const added = [
        ...(state.added || []),
        { field: action.name, value: action.value },
      ];
      return {
        ...state,
        added: [...new Set(added.map((i) => JSON.stringify(i)))].map((i) =>
          JSON.parse(i),
        ),
      };
    case "REMOVE_FIELD":
      return {
        ...state,
        removed: [...new Set([...(state.removed || []), action.field])],
      };
    case "EDIT_FIELD":
      const edited = [
        ...(state.edited || []),
        { field: action.field, value: action.value },
      ];
      return {
        ...state,
        edited: [...new Set(edited.map((i) => JSON.stringify(i)))].map((i) =>
          JSON.parse(i),
        ),
      };
    case "SET_ORDER":
      return { ...state, order: action.order };
    case "SET_EXPORT":
      return { ...state, export: action.export };
    case "SET_WIDTHS":
      return { ...state, widths: action.widths };
    case "SET_SYMBOL":
      return { ...state, symbol: action.symbol };
    default:
      return state;
  }
};

export const DataContextProvider = ({ children }: DataProviderProps) => {
  const [data, dispatchData] = useReducer(dataReducer, []);
  const [preset, dispatchPreset] = useReducer(presetReducer, {
    name: null,
    removed: null,
    added: null,
    edited: null,
    order: [],
    export: "csv",
    widths: null,
    symbol: null,
  });

  useEffect(() => {
    const allPresets: Preset[] = [];

    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith("preset")) {
        const preset = localStorage.getItem(key);
        if (preset) {
          allPresets.push(JSON.parse(preset));
        }
      }
    });

    console.log(allPresets);
  }, []);

  const setData = (data: Record<string, unknown>[]) => {
    dispatchData({ type: "SET_DATA", data: data });
    dispatchPreset({ type: "SET_ORDER", order: Object.keys(data[0] || {}) });
  };

  const addField = (name: string, value: string) => {
    dispatchData({ type: "ADD_FIELD", name, value });
    dispatchPreset({ type: "ADD_FIELD", name, value });
  };

  const removeField = (field: string) => {
    dispatchData({ type: "REMOVE_FIELD", field });
    dispatchPreset({ type: "REMOVE_FIELD", field });
  };

  const editField = (field: string, value: string) => {
    dispatchData({ type: "EDIT_FIELD", field, value });
    dispatchPreset({ type: "EDIT_FIELD", field, value });
  };

  const orderFields = (order: string[]) => {
    dispatchData({ type: "ORDER_FIELDS", order });
    dispatchPreset({ type: "SET_ORDER", order });
  };

  const loadPreset = (preset: Preset) => {
    preset.removed?.forEach((field) => removeField(field));
    preset.added?.forEach(({ field, value }) => addField(field, value));
    preset.edited?.forEach(({ field, value }) => editField(field, value));
    preset.order && orderFields(preset.order);
    dispatchPreset({ type: "SET_EXPORT", export: preset.export });
    dispatchPreset({ type: "SET_WIDTHS", widths: preset.widths });
    dispatchPreset({ type: "SET_SYMBOL", symbol: preset.symbol });
  };

  const savePreset = (name: string) => {
    const newPreset = { ...preset, name };
    localStorage.setItem(`preset ${name}`, JSON.stringify(newPreset, null, 2));
  };

  const exportPreset = () => {
    console.log(JSON.stringify(preset, null, 2));
  };

  return (
    <DataContext.Provider
      value={{
        data,
        preset,
        setData,
        addField,
        removeField,
        editField,
        arrangeFields: orderFields,
        loadPreset,
        savePreset,
        exportPreset,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};
