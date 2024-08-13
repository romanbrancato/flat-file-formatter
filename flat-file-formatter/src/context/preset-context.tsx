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
import { FormatSchema } from "@/components/format-menu";

export const FieldSchema = z.object(
  {
    flag: z.enum(["header", "detail", "trailer"]),
    name: z.string(),
  },
  { required_error: "Select a field." },
);

export type Field = z.infer<typeof FieldSchema>;

export const AddFieldSchema = z.object({
  flag: z.enum(["header", "detail", "trailer"]),
  name: z.string().min(1, "Enter a field name."),
  value: z.string(),
});

export type AddField = z.infer<typeof AddFieldSchema>;

export const OrderSchema = z.object({
  header: z.array(z.string()),
  detail: z.array(z.string()),
  trailer: z.array(z.string()),
});

export const FunctionSchema = z.discriminatedUnion("operation", [
  z.object({
    operation: z.literal("conditional"),
    conditions: z.array(
      z.object({
        statement: z.enum(["if", "if not"]),
        field: FieldSchema,
        overpunch: z.boolean(),
        comparison: z.enum(["<", "===", ">"]),
        value: z.string(),
      }),
    ),
    output: FieldSchema,
    valueTrue: z.string(),
    valueFalse: z.string(),
  }),
  z.object({
    operation: z.literal("equation"),
    formulas: z.array(
      z.object({
        operator: z.enum(["+", "-"]),
        field: FieldSchema,
        overpunch: z.boolean(),
      }),
    ),
    output: FieldSchema,
    overpunch: z.boolean(),
  }),
  z.object({
    operation: z.literal("total"),
    fields: z.array(
      z.object({
        field: FieldSchema,
        overpunch: z.boolean(),
      }),
    ),
    output: FieldSchema,
    overpunch: z.boolean(),
  }),
]);

export type Function = z.infer<typeof FunctionSchema>;

export const TransformSchema = z.object({
  fileName: z.string(),
  order: OrderSchema,
  remove: z.array(FieldSchema),
  add: z.array(AddFieldSchema),
  functions: z.array(FunctionSchema),
});

export const PresetSchema = z.object({
  name: z.string().nullable(),
  format: FormatSchema,
  transform: TransformSchema,
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
    setPreset({} as Preset);
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
