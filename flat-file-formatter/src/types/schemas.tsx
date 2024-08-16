import { z } from "zod";

export const ParserFieldSchema = z.object({
  fields: z
    .array(
      z.object({
        property: z.string(),
        width: z.coerce.number(),
      }),
    )
    .superRefine((widths, ctx) => {
      widths.forEach((field, index) => {
        if (!field.property) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
          });
        }
        if (field.width <= 0) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
          });
        }
      });
    }),
});

export const ParserConfigSchema = z.discriminatedUnion("format", [
  z.object({
    format: z.literal("delimited"),
  }),
  z.object({
    format: z.literal("fixed"),
    header: ParserFieldSchema.nullable(),
    detail: ParserFieldSchema,
    trailer: ParserFieldSchema.nullable(),
  }),
]);

export type ParserConfig = z.infer<typeof ParserConfigSchema>;

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

//have an actionTrue and actionFalse
export const ActionSchema = z.discriminatedUnion("action", [
  z.object({
    action: z.literal("remove"),
  }),
  z.object({
    action: z.literal("separate"),
    tag: z.string(),
  }),
  z.object({
    action: z.literal("setValue"),
    field: FieldSchema,
    value: z.string(),
  }),
]);

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
    //replace with actionTrue, actionFalse later
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

export const FormatSchema = z.discriminatedUnion("format", [
  z.object({
    format: z.literal("delimited"),
    delimiter: z.string(),
  }),
  z.object({
    format: z.literal("fixed"),
    pad: z.string(),
    align: z.enum(["left", "right"]),
    widths: z.object({
      header: z.record(z.coerce.number().min(1)),
      detail: z.record(z.coerce.number().min(1)),
      trailer: z.record(z.coerce.number().min(1)),
    }),
  }),
]);

export type Format = z.infer<typeof FormatSchema>;

export const ChangesSchema = z.object({
  fileName: z.string(),
  order: z.object({
    header: z.array(z.string()),
    detail: z.array(z.string()),
    trailer: z.array(z.string()),
  }),
  remove: z.array(FieldSchema),
  add: z.array(AddFieldSchema),
  functions: z.array(FunctionSchema),
});

export type Changes = z.infer<typeof ChangesSchema>;

export const PresetSchema = z.object({
  name: z.string().nullable(),
  parser: ParserConfigSchema,
  formatSpec: FormatSchema,
  changes: ChangesSchema,
});

export type Preset = z.infer<typeof PresetSchema>;
