import { z } from "zod";

const DataSchema = z.record(
  z.object({
    fields: z.array(z.string()),
    rows: z.array(z.array(z.string())),
  }),
);

export type Data = z.infer<typeof DataSchema>;

export const ParserFieldSchema = z.object({
  fields: z
    .array(
      z.object({
        property: z.string(),
        width: z.coerce.number(),
      }),
    )
});

export const ParserConfigSchema = z.discriminatedUnion("format", [
  z.object({
    format: z.literal("delimited"),
    delimiter: z.string(),
  }),
  z.object({
    format: z.literal("fixed"),
    header: ParserFieldSchema.nullable(),
    detail: ParserFieldSchema,
    trailer: ParserFieldSchema.nullable(),
  }),
]);

export type ParserConfig = z.infer<typeof ParserConfigSchema>;

export const DataProcessorParams = z.object({
  buffer: z.instanceof(Uint8Array),
  config: ParserConfigSchema,
});

export type DataProcessorParams = z.infer<typeof DataProcessorParams>;

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
    action: z.literal("set value"),
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
    reformat: z.discriminatedUnion("type", [
      z.object({
        type: z.literal("date"),
        pattern: z.string(),
      }),
      z.object({
        type: z.literal("number"),
        overpunch: z.boolean(),
        pattern: z.string(),
      }),
    ]),
  }),
]);

export type Operation = z.infer<typeof OperationSchema>;

export const DelimitedSchema = z.object({
  format: z.literal("delimited"),
  delimiter: z.string()
});

export type Delimited = z.infer<typeof DelimitedSchema>;

export const FixedSchema = z.object({
  format: z.literal("fixed"),
  pad: z.string(),
  align: z.enum(["left", "right"]),
  widths: z.record(z.record(z.coerce.number()))
});

export type Fixed = z.infer<typeof FixedSchema>;

export const FormatSchema = z.discriminatedUnion("format", [
  DelimitedSchema,
  FixedSchema
]);

export type Format = z.infer<typeof FormatSchema>;

export const OutputSchema = z.object({
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
  changes: z.array(OperationSchema),
  format: FormatSchema,
  output: OutputSchema,
});

export type Preset = z.infer<typeof PresetSchema>;
