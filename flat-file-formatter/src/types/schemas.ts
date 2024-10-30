import { boolean, z } from "zod";

const DataSchema = z.object({
  records: z.record(
    z.object({
      fields: z.array(z.string()),
      rows: z.array(z.array(z.string())),
    }),
  ),
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

export const FieldSchema = z.object(
  {
    tag: z.string().min(1),
    name: z.string().min(1),
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
    values: z.array(
      z.object({
        field: FieldSchema,
        value: z.string(),
      }),
    ),
  }),
  z.object({
    action: z.literal("duplicate"),
    rowOriginal: z.array(
      z.object({
        field: FieldSchema,
        value: z.string(),
      }),
    ),
    rowDuplicate: z.array(
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

export type Action = z.infer<typeof ActionSchema>;

export const ReformatSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("date"),
    pattern: z.string(),
  }),
  z.object({
    type: z.literal("number"),
    overpunch: boolean(),
    pattern: z.string(),
  }),
]);

export const OperationSchema = z.discriminatedUnion("operation", [
  z.object({
    operation: z.literal("add"),
    tag: z.string(),
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
    tag: z.string(),
    conditions: z.array(
      z.object({
        statement: z.enum(["if", "if not"]),
        field: FieldSchema,
        comparison: z.enum(["<", "<=", "=", ">=", ">"]),
        value: z.string(),
      }),
    ),
    actionTrue: ActionSchema,
    actionFalse: ActionSchema,
  }),
  z.object({
    operation: z.literal("equation"),
    tag: z.string(),
    direction: z.enum(["row", "column"]),
    equation: z.array(
      z.object({
        operator: z.enum(["+", "-"]),
        field: FieldSchema,
      }),
    ),
    output: FieldSchema,
  }),
  z.object({
    operation: z.literal("reformat"),
    tag: z.string(),
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
    widths: z.record(z.record(z.coerce.number())),
  }),
]);

export const ChangesSchema = z.object({
  order: z.record(z.array(z.string())),
  history: z.array(OperationSchema),
});

export type Changes = z.infer<typeof ChangesSchema>;

export const OutputSchema = z.object({
  details: FormatSchema,
  groups: z.array(
    z.object({
      name: z.string().min(1),
      tags: z.array(z.string()),
      ordering: z.enum(["in order", "round robin"]),
    }),
  ),
});

export type Output = z.infer<typeof OutputSchema>;

export const PresetSchema = z.object({
  name: z.string().nullable(),
  parser: ParserConfigSchema,
  changes: ChangesSchema,
  output: OutputSchema,
});

export type Preset = z.infer<typeof PresetSchema>;
