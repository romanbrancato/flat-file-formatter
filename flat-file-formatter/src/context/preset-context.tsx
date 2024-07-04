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
  setPreset: React.Dispatch<React.SetStateAction<Preset>>;
  resetPreset: () => void;
}

export const PresetContext = createContext<PresetContextProps>({
  preset: {} as Preset,
  setPreset: () => {},
  resetPreset: () => {},
});

export const PresetProvider = ({ children }: { children: ReactNode }) => {
  const [preset, setPreset] = useState<Preset>({} as Preset);

  function resetPreset() {
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

  return (
    <PresetContext.Provider
      value={{
        preset,
        setPreset,
        resetPreset,
      }}
    >
      {children}
    </PresetContext.Provider>
  );
};
