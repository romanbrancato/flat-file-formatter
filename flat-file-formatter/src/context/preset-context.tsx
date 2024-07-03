"use client";
import { createContext, ReactNode, useState } from "react";
import { z } from "zod";

export const FunctionSchema = z.object({
  field: z.string({ required_error: "Select a field to edit." }),
  operation: z.enum(["if", "if not"], {
    required_error: "Select a operation.",
  }),
  condition: z.string(),
  resultField: z.string({ required_error: "Select a result field." }),
  valueTrue: z.string(),
  valueFalse: z.string(),
});

export type Function = z.infer<typeof FunctionSchema>;

export const PresetSchema = z.object({
  name: z.string().nullable(),
  schema: z.string(),
  order: z.array(z.string()),
  symbol: z.string(),
  widths: z.array(z.record(z.number())),
  align: z.enum(["left", "right"]),
  header: z.boolean(),
  format: z.enum(["delimited", "fixed"]),
  export: z.enum(["csv", "txt"]),
  removed: z.array(z.string()),
  added: z.array(z.record(z.string())),
  functions: z.array(FunctionSchema),
  editedHeaders: z.array(z.record(z.string())),
});

export type Preset = z.infer<typeof PresetSchema>;

interface PresetContextProps {
  preset: Preset;
  setName: (name: string) => void;
  setSchema: (schema: string) => void;
  setOrder: (order: string[]) => void;
  setSymbol: (symbol: string) => void;
  setWidths: (widths: Record<string, number>[]) => void;
  setAlign: (align: "left" | "right") => void;
  setHeader: (header: boolean) => void;
  setFormat: (format: "delimited" | "fixed") => void;
  setExport: (exportType: "csv" | "txt") => void;
  removeField: (field: string) => void;
  addField: (field: Record<string, string>) => void;
  addFunction: (func: Function) => void;
  editHeader: (field: Record<string, string>) => void;
  resetPreset: () => void;
  savePreset: () => void;
}

export const PresetContext = createContext<PresetContextProps>({
  preset: {} as Preset,
  setName: () => {},
  setSchema: () => {},
  setOrder: () => {},
  setSymbol: () => {},
  setWidths: () => {},
  setAlign: () => {},
  setHeader: () => {},
  setFormat: () => {},
  setExport: () => {},
  removeField: () => {},
  addField: () => {},
  addFunction: () => {},
  editHeader: () => {},
  resetPreset: () => {},
  savePreset: () => {},
});

export const PresetProvider = ({ children }: { children: ReactNode }) => {
  const [preset, setPreset] = useState<Preset>({} as Preset);

  function setName(name: string) {
    setPreset({ ...preset, name: name });
  }

  function setSchema(schema: string) {
    setPreset({ ...preset, schema: schema });
  }

  function setOrder(order: string[]) {
    setPreset({ ...preset, order: order });
  }

  function setSymbol(symbol: string) {
    setPreset({ ...preset, symbol: symbol });
  }

  function setWidths(widths: Record<string, number>[]) {
    setPreset({ ...preset, widths: widths });
  }

  function setAlign(align: "left" | "right") {
    setPreset({ ...preset, align: align });
  }

  function setHeader(header: boolean) {
    setPreset({ ...preset, header: header });
  }

  function setFormat(format: "delimited" | "fixed") {
    setPreset({ ...preset, format: format });
  }

  function setExport(exportType: "csv" | "txt") {
    setPreset({ ...preset, export: exportType });
  }

  function removeField(field: string) {
    setPreset({ ...preset, removed: [...preset.removed, field] });
  }

  function addField(field: Record<string, string>) {
    setPreset({ ...preset, added: [...preset.added, field] });
  }

  function addFunction(func: Function) {
    setPreset({ ...preset, functions: [...preset.functions, func] });
  }

  function editHeader(field: Record<string, string>) {
    setPreset({ ...preset, editedHeaders: [...preset.editedHeaders, field] });
  }

  function resetPreset(preset: Preset) {
    setPreset({
      name: null,
      schema: "",
      order: [],
      symbol: ",",
      widths: [],
      align: "left",
      header: true,
      format: "delimited",
      export: "csv",
      removed: [],
      added: [],
      functions: [],
      editedHeaders: [],
    });
  }

  function savePreset(preset: Preset) {
    localStorage.setItem(
      `preset_${preset.name}`,
      JSON.stringify({ ...preset }, null, 2),
    );
    window.dispatchEvent(new Event("storage"));
  }

  return (
    <PresetContext.Provider
      value={{
        preset,
        setPreset,
        setName,
        setSchema,
        setOrder,
        setSymbol,
        setWidths,
        setAlign,
        setHeader,
        setFormat,
        setExport,
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
