import { z } from "zod";

export const LoadFieldSchema = z.object({
  fields: z.array(
    z.object({
      property: z.string(),
      width: z.coerce.number(),
    }),
  ),
});

export const LoadConfigSchema = z.discriminatedUnion("format", [
  z.object({
    format: z.literal("delimited"),
    name: z.string(),
    delimiter: z.string().optional(),
    skipRows: z.string().optional(),
    primaryKey: z.string().optional(),
  }),
  z.object({
    format: z.literal("fixed"),
    name: z.string(),
    widths: LoadFieldSchema,
    skipRows: z.string().optional(),
    primaryKey: z.string().optional(),
  }),
]);

export type LoadConfig = z.infer<typeof LoadConfigSchema>;

export const DelimitedSchema = z.object({
  format: z.literal("delimited"),
  delimiter: z.string(),
});

export type Delimited = z.infer<typeof DelimitedSchema>;

export const FixedSchema = z.object({
  format: z.literal("fixed"),
  pad: z.string(),
  align: z.enum(["left", "right"]),
  widths: z.record(z.record(z.coerce.number())),
});

export type Fixed = z.infer<typeof FixedSchema>;

export const FormatSchema = z.discriminatedUnion("format", [
  DelimitedSchema,
  FixedSchema,
]);

export type Format = z.infer<typeof FormatSchema>;

export const ExportSchema = z.object({
  files: z.array(z.object({name:z.string(), query:z.string()})),
});

export type Export = z.infer<typeof ExportSchema>;

export const PresetSchema = z.object({
  name: z.string(),
  parser: LoadConfigSchema,
  queries: z.array(z.string()),
  format: FormatSchema,
  export: ExportSchema,
});

export type Preset = z.infer<typeof PresetSchema>;
