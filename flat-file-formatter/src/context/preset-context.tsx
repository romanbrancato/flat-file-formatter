"use client";
import {
  createContext,
  ReactNode,
  useEffect,
  useReducer,
  useState,
} from "react";
import {Func, Preset} from "@/types/preset";

interface PresetContextProps {
  preset: Preset;
  savedPresets: Preset[];
  setPreset: (preset: Preset) => void;
  setName: (name: string) => void;
  setSchema: (nameTemplate: string) => void;
  setOrder: (order: string[]) => void;
  setSymbol: (symbol: string) => void;
  setWidths: (widths: Record<string, number>[]) => void;
  setFormat: (format: string) => void;
  setExport: (exportType: string) => void;
  setAlign: (padPos: string) => void;
  setHeader: (header: boolean) => void;
  removeField: (field: string) => void;
  addField: (field: Record<string, unknown>) => void;
  addFunction: (func: Func) => void;
  editHeader: (field: Record<string, unknown>) => void;
  resetPreset: () => void;
  savePreset: () => void;
}

export const PresetContext = createContext<PresetContextProps>({
  preset: {} as Preset,
  savedPresets: [],
  setPreset: () => {},
  setName: () => {},
  setSchema: () => {},
  setOrder: () => {},
  setSymbol: () => {},
  setWidths: () => {},
  setFormat: () => {},
  setExport: () => {},
  setAlign: () => {},
  setHeader: () => {},
  removeField: () => {},
  addField: () => {},
  addFunction: () => {},
  editHeader: () => {},
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
    case "SET_SCHEMA":
      return { ...state, schema: action.schema };
    case "SET_ORDER":
      return { ...state, order: action.order };
    case "SET_SYMBOL":
      return { ...state, symbol: action.symbol };
    case "SET_WIDTHS":
      return { ...state, widths: action.widths };
    case "SET_FORMAT":
      return { ...state, format: action.format };
    case "SET_EXPORT":
      return { ...state, export: action.export };
    case "SET_ALIGN":
      return { ...state, align: action.align };
    case "SET_HEADER":
      return { ...state, header: action.header };
    case "REMOVE_FIELD":
      return {
        ...state,
        removed: [...state.removed, action.field],
      };
    case "ADD_FIELD":
      return {
        ...state,
        added: [...state.added, action.field],
      };
    case "ADD_FUNCTION":
      return {
        ...state,
        functions: [...state.functions, action.func],
      };
    case "EDIT_HEADER":
      return {
        ...state,
        editedHeaders: [...state.editedHeaders, action.field],
      };
    case "RESET":
      return {
        name: null,
        schema: "",
        order: [],
        symbol: ",",
        widths: [],
        format: "csv",
        export: "csv",
        align: "left",
        header: true,
        removed: [],
        added: [],
        functions: [],
        editedHeaders: [],
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
    schema: "",
    order: [],
    symbol: ",",
    widths: [],
    format: "csv",
    export: "csv",
    align: "left",
    header: true,
    removed: [],
    added: [],
    functions: [],
    editedHeaders: [],
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

  const setSchema = (schema: string) => {
    dispatchPreset({ type: "SET_SCHEMA", schema });
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

  const setFormat = (format: string) => {
    dispatchPreset({ type: "SET_FORMAT", format });
  };

  const setExport = (exportType: string) => {
    dispatchPreset({ type: "SET_EXPORT", export: exportType });
  };

  const removeField = (field: string) => {
    dispatchPreset({ type: "REMOVE_FIELD", field });
  };

  const addField = (field: Record<string, unknown>) => {
    dispatchPreset({ type: "ADD_FIELD", field });
  };

  const addFunction = (func: Func) => {
    dispatchPreset({ type: "ADD_FUNCTION", func });
  };

  const editHeader = (field: Record<string, unknown>) => {
    dispatchPreset({ type: "EDIT_HEADER", field });
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
        setSchema,
        setOrder,
        setSymbol,
        setWidths,
        setFormat,
        setExport,
        setAlign,
        setHeader,
        removeField,
        addField,
        addFunction,
        editHeader,
        resetPreset,
        savePreset,
      }}
    >
      {children}
    </PresetContext.Provider>
  );
};
