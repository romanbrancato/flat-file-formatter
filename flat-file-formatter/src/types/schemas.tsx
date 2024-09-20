import { z } from "zod";

const DataSchema = z.object({
  name: z.string(),
  records: z.record(z.array(z.record(z.string()))),
});

export type Data = z.infer<typeof DataSchema>;

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

export const PatternSchema = z.object({
  pattern: z.string(),
});

export type Pattern = z.infer<typeof PatternSchema>;
export const FieldSchema = z.object(
  {
    flag: z.string(),
    name: z.string(),
  },
  { required_error: "Select a field." },
);

export type Field = z.infer<typeof FieldSchema>;

export const ActionSchema = z.discriminatedUnion("action", [
  z.object({
    action: z.literal("separate"),
    tag: z.string(),
  }),
  z.object({
    action: z.literal("setValue"),
    field: FieldSchema,
    value: z.string(),
  }),
  z.object({
    action: z.literal("duplicate"),
    firstRecord: z.array(
      z.object({
        field: FieldSchema,
        value: z.string(),
      }),
    ),
    secondRecord: z.array(
      z.object({
        field: FieldSchema,
        value: z.string(),
      }),
    ),
  }),
  z.object({
    action: z.literal("nothing"),
  }),
]);

export const ReformatSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("date"),
    pattern: z.string(),
  }),
  z.object({
    type: z.literal("number"),
    from: z.enum(["scientific", "overpunch"]),
  }),
]);

export const OperationSchema = z.discriminatedUnion("operation", [
  z.object({
    operation: z.literal("add"),
    flag: z.string(),
    fields: z.array(
      z.object({
        name: z.string().min(1, "Enter a field name."),
        value: z.string(),
      }),
    ),
    after: FieldSchema.nullable(),
  }),
  z.object({
    operation: z.literal("remove"),
    fields: z.array(FieldSchema),
  }),
  z.object({
    operation: z.literal("conditional"),
    conditions: z.array(
      z.object({
        statement: z.enum(["if", "if not"]),
        field: FieldSchema,
        comparison: z.enum(["<", "=", ">"]),
        value: z.string(),
      }),
    ),
    actionTrue: ActionSchema,
    actionFalse: ActionSchema,
  }),
  z.object({
    operation: z.literal("equation"),
    direction: z.enum(["row", "column"]),
    formula: z.array(
      z.object({
        operator: z.enum(["+", "-"]),
        field: FieldSchema,
      }),
    ),
    output: FieldSchema,
  }),
  z.object({
    operation: z.literal("reformat"),
    fields: z.array(FieldSchema),
    reformat: ReformatSchema,
  }),
]);

export type Operation = z.infer<typeof OperationSchema>;

export const FormatSchema = z.discriminatedUnion("format", [
  z.object({
    format: z.literal("delimited"),
    delimiter: z.string(),
  }),
  z.object({
    format: z.literal("fixed"),
    pad: z.string(),
    align: z.enum(["left", "right"]),
    widths: z.record(z.record(z.coerce.number().min(1))),
  }),
]);

export type Format = z.infer<typeof FormatSchema>;

export const ChangesSchema = z.object({
  pattern: z.string(),
  order: z.record(z.array(z.string())),
  history: z.array(OperationSchema),
});

export type Changes = z.infer<typeof ChangesSchema>;

export const PresetSchema = z.object({
  name: z.string().nullable(),
  parser: ParserConfigSchema,
  formatSpec: FormatSchema,
  changes: ChangesSchema,
});

export type Preset = z.infer<typeof PresetSchema>;
