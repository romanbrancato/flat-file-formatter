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
  header: z.array(z.string()),
  detail: z.array(z.string()),
  trailer: z.array(z.string()),
});

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

export const WidthsSchema = z.object({
  header: z.record(z.coerce.number().min(1)),
  detail: z.record(z.coerce.number().min(1)),
  trailer: z.record(z.coerce.number().min(1)),
});

export type Widths = z.infer<typeof WidthsSchema>;

export const PresetSchema = z.object({
  name: z.string().nullable(),
  schema: z.string(),
  order: OrderSchema,
  symbol: z.string(),
  widths: WidthsSchema,
  align: z.enum(["left", "right"]),
  label: z.boolean(),
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
      order: {
        header: [],
        detail: [],
        trailer: [],
      },
      symbol: ",",
      widths: {
        header: {},
        detail: {},
        trailer: {},
      },
      align: "left",
      label: false,
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
