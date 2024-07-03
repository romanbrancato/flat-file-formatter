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

export function setName(preset: Preset, name: string): Preset {
  return { ...preset, name: name };
}

export function setSchema(preset: Preset, schema: string): Preset {
  return { ...preset, schema: schema };
}

export function setOrder(preset: Preset, order: string[]): Preset {
  return { ...preset, order: order };
}

export function setSymbol(preset: Preset, symbol: string): Preset {
  return { ...preset, symbol: symbol };
}

export function setWidths(
  preset: Preset,
  widths: Record<string, number>[],
): Preset {
  return { ...preset, widths: widths };
}

export function setAlign(preset: Preset, align: "left" | "right"): Preset {
  return { ...preset, align: align };
}

export function setHeader(preset: Preset, header: boolean): Preset {
  return { ...preset, header: header };
}

export function setFormat(
  preset: Preset,
  format: "delimited" | "fixed",
): Preset {
  return { ...preset, format: format };
}

export function setExport(preset: Preset, exportType: "csv" | "txt"): Preset {
  return { ...preset, export: exportType };
}

export function removeField(preset: Preset, field: string): Preset {
  return { ...preset, removed: [...preset.removed, field] };
}

export function addField(
  preset: Preset,
  field: Record<string, string>,
): Preset {
  return { ...preset, added: [...preset.added, field] };
}

export function addFunction(preset: Preset, func: Function): Preset {
  return { ...preset, functions: [...preset.functions, func] };
}

export function editHeader(
  preset: Preset,
  field: Record<string, string>,
): Preset {
  return { ...preset, editedHeaders: [...preset.editedHeaders, field] };
}

export function resetPreset(preset: Preset): Preset {
  return {
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
  };
}

export function savePreset(preset: Preset) {
  localStorage.setItem(
    `preset_${preset.name}`,
    JSON.stringify({ ...preset }, null, 2),
  );
  window.dispatchEvent(new Event("storage"));
}
