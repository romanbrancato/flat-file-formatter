"use client";
import {
  createContext,
  ReactNode,
  useEffect,
  useReducer,
  useState,
} from "react";
import { Preset } from "@/types/preset";

interface PresetContextProps {
  preset: Preset;
  savedPresets: Preset[];
  setPreset: (preset: Preset) => void;
  setName: (name: string) => void;
  setOrder: (order: string[]) => void;
  setSymbol: (symbol: string) => void;
  setWidths: (widths: Record<string, number>[]) => void;
  setExport: (exportType: string) => void;
  setAlign: (padPos: string) => void;
  setHeader: (header: boolean) => void;
  removeField: (field: string) => void;
  addField: (name: string, value: string) => void;
  editField: (field: string, value: string) => void;
  resetPreset: () => void;
  savePreset: () => void;
}

export const PresetContext = createContext<PresetContextProps>({
  preset: {} as Preset,
  savedPresets: [],
  setPreset: () => {},
  setName: () => {},
  setOrder: () => {},
  setSymbol: () => {},
  setWidths: () => {},
  setExport: () => {},
  setAlign: () => {},
  setHeader: () => {},
  removeField: () => {},
  addField: () => {},
  editField: () => {},
  resetPreset: () => {},
  savePreset: () => {},
});

interface PresetProviderProps {
  children: ReactNode;
}

const presetReducer = (state: Preset, action: any): Preset => {
  switch (action.type) {
    case "SET_PRESET":
      return action.preset;
    case "SET_NAME":
      return { ...state, name: action.name };
    case "SET_ORDER":
      return { ...state, order: action.order };
    case "SET_SYMBOL":
      return { ...state, symbol: action.symbol };
    case "SET_WIDTHS":
      return { ...state, widths: action.widths };
    case "SET_EXPORT":
      return { ...state, export: action.export };
    case "SET_ALIGN":
      return { ...state, align: action.align };
    case "SET_HEADER":
      return { ...state, header: action.header };
    case "REMOVE_FIELD":
      const newOrder = state.order.filter((field) => field !== action.field);
      return {
        ...state,
        order: newOrder,
        removed: [...new Set([...(state.removed || []), action.field])],
      };
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
    case "RESET":
      return {
        name: null,
        order: [],
        symbol: ",",
        widths: [],
        export: "csv",
        align: "left",
        header: true,
        removed: [],
        added: [],
        edited: [],
      };
    case "SAVE":
      localStorage.setItem(
        `preset_${state.name}`,
        JSON.stringify({ ...state }, null, 2),
      );
      window.dispatchEvent(new Event("storage"));
      return state;
    default:
      return state;
  }
};

export const PresetContextProvider = ({ children }: PresetProviderProps) => {
  const [preset, dispatchPreset] = useReducer(presetReducer, {
    name: null,
    order: [],
    symbol: ",",
    widths: [],
    export: "csv",
    align: "left",
    header: true,
    removed: [],
    added: [],
    edited: [],
  });
  const [savedPresets, setSavedPresets] = useState<Preset[]>([]);

  useEffect(() => {
    function getSavedPresets() {
      setSavedPresets(
        Object.keys(localStorage)
          .filter((key) => key.startsWith("preset"))
          .map((key) => JSON.parse(localStorage.getItem(key) || "")),
      );
    }

    getSavedPresets();

    window.addEventListener("storage", getSavedPresets);

    return () => {
      window.removeEventListener("storage", getSavedPresets);
    };
  }, []);

  const setPreset = (preset: Preset) => {
    dispatchPreset({ type: "SET_PRESET", preset });
  };

  const setName = (name: string) => {
    dispatchPreset({ type: "SET_NAME", name });
  };

  const setOrder = (order: string[]) => {
    dispatchPreset({ type: "SET_ORDER", order });
  };

  const setSymbol = (symbol: string) => {
    dispatchPreset({ type: "SET_SYMBOL", symbol });
  };

  const setWidths = (widths: Record<string, number>[]) => {
    dispatchPreset({ type: "SET_WIDTHS", widths });
  };

  const setAlign = (align: string) => {
    dispatchPreset({ type: "SET_ALIGN", align });
  };

  const setHeader = (header: boolean) => {
    dispatchPreset({ type: "SET_HEADER", header });
  };

  const setExport = (exportType: string) => {
    dispatchPreset({ type: "SET_EXPORT", export: exportType });
  };

  const removeField = (field: string) => {
    dispatchPreset({ type: "REMOVE_FIELD", field });
  };

  const addField = (name: string, value: string) => {
    dispatchPreset({ type: "ADD_FIELD", name, value });
  };

  const editField = (field: string, value: string) => {
    dispatchPreset({ type: "EDIT_FIELD", field, value });
  };

  const resetPreset = () => {
    dispatchPreset({ type: "RESET" });
  };

  const savePreset = () => {
    dispatchPreset({ type: "SAVE" });
  };

  return (
    <PresetContext.Provider
      value={{
        preset,
        savedPresets,
        setPreset,
        setName,
        setOrder,
        setSymbol,
        setWidths,
        setExport,
        setAlign,
        setHeader,
        removeField,
        addField,
        editField,
        resetPreset,
        savePreset,
      }}
    >
      {children}
    </PresetContext.Provider>
  );
};
