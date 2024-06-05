import { z } from "zod";

export const PresetSchema = z.object({
  name: z.string().nullable(),
  order: z.array(z.string()),
  symbol: z.string(),
  widths: z.array(z.record(z.number())),
  export: z.enum(["csv", "txt"]),
  removed: z.array(z.string()),
  added: z.array(z.record(z.string())),
  edited: z.array(z.record(z.string())),
});

export type Preset = z.infer<typeof PresetSchema>;
