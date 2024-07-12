"use client";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { z } from "zod";
import { ModeContext } from "@/context/mode-context";

export const FieldSchema = z.object(
  {
    flag: z.enum(["header", "detail", "trailer"]),
    name: z.string(),
  },
  { required_error: "Select a field." },
);

export type Field = z.infer<typeof FieldSchema>;

export const FieldValueSchema = z
  .object({
    value: z.string(),
  })
  .and(FieldSchema);

export type FieldValue = z.infer<typeof FieldValueSchema>;

export const OrderSchema = z.object({
  flag: z.enum(["header", "detail", "trailer"]),
  order: z.array(z.string()),
});

export type Order = z.infer<typeof OrderSchema>;

export const FunctionSchema = z.object({
  field: FieldSchema,
  operation: z.enum(["if", "if not"], {
    required_error: "Select a operation.",
  }),
  condition: z.string(),
  resultField: FieldSchema,
  valueTrue: z.string(),
  valueFalse: z.string(),
});

export type Function = z.infer<typeof FunctionSchema>;

export const PresetSchema = z.object({
  name: z.string().nullable(),
  schema: z.string(),
  order: z.array(OrderSchema),
  symbol: z.string(),
  widths: z.array(z.record(z.number())),
  align: z.enum(["left", "right"]),
  header: z.boolean(),
  format: z.enum(["delimited", "fixed"]),
  export: z.enum(["csv", "txt"]),
  removed: z.array(FieldSchema),
  added: z.array(FieldValueSchema),
  functions: z.array(FunctionSchema),
  editedHeaders: z.array(FieldValueSchema),
});

export type Preset = z.infer<typeof PresetSchema>;

export const PresetContext = createContext<{
  preset: Preset;
  setPreset: React.Dispatch<React.SetStateAction<Preset>>;
  resetPreset: () => void;
}>({
  preset: {} as Preset,
  setPreset: () => {},
  resetPreset: () => {},
});

export const PresetProvider = ({ children }: { children: ReactNode }) => {
  const { mode } = useContext(ModeContext);
  const [preset, setPreset] = useState<Preset>({} as Preset);

  function resetPreset() {
    setPreset({
      name: null,
      schema: "",
      order: [],
      symbol: ",",
      widths: [],
      align: "left",
      header: false,
      format: "delimited",
      export: "csv",
      removed: [],
      added: [],
      functions: [],
      editedHeaders: [],
    });
  }

  useEffect(() => {
    resetPreset();
  }, [mode]);

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
