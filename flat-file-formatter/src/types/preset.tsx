import { z } from "zod";

export const FuncSchema = z.object({
  field: z.string(),
  function: z.string(),
  condition: z.string(),
  then: z.string(),
  valueTrue: z.string(),
  valueFalse: z.string()
});

export type Func = z.infer<typeof FuncSchema>;

export const PresetSchema = z.object({
  name: z.string().nullable(),
  schema: z.string(),
  order: z.array(z.string()),
  symbol: z.string(),
  widths: z.array(z.record(z.number())),
  align: z.enum(["left", "right"]),
  header: z.boolean(),
  format: z.enum(["csv", "fixed"]),
  export: z.enum(["csv", "txt"]),
  removed: z.array(z.string()),
  added: z.array(z.record(z.string())),
  functions: z.array(FuncSchema),
  editedHeaders: z.array(z.record(z.string())),
});

export type Preset = z.infer<typeof PresetSchema>;
