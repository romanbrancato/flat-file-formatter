import { z } from "zod";

export const LoadFieldSchema = z.object({
  fields: z.array(
    z.object({
      property: z.string(),
      width: z.coerce.number()
    })
  )
});

const BaseLoadSchema = z.object({
  tablename: z.string(),
  skipRows: z.string().optional()
});

export const LoadConfigSchema = z.discriminatedUnion("format", [
  BaseLoadSchema.merge(
    z.object({
      format: z.literal("delimited"),
      delimiter: z.string().optional()
    })
  ),
  BaseLoadSchema.merge(
    z.object({
      format: z.literal("fixed"),
      widths: LoadFieldSchema
    })
  )
]);

export type LoadConfig = z.infer<typeof LoadConfigSchema>;

export const DelimitedSchema = z.object({
  format: z.literal("delimited"),
  delimiter: z.string()
});

export type Delimited = z.infer<typeof DelimitedSchema>;

export const FixedSchema = z.object({
  format: z.literal("fixed"),
  pad: z.string(),
  align: z.enum(["left", "right"]),
  widths: z.record(z.record(z.coerce.number().optional()).optional())
});

export type Fixed = z.infer<typeof FixedSchema>;

export const FormatSchema = z.discriminatedUnion("format", [
  DelimitedSchema,
  FixedSchema
]);

export type Format = z.infer<typeof FormatSchema>;

export const PresetSchema = z.object({
  name: z.string(),
  load: z.array(LoadConfigSchema),
  queries: z.array(z.string()),
  format: FormatSchema,
  export: z.string()
});

export type Preset = z.infer<typeof PresetSchema>;
