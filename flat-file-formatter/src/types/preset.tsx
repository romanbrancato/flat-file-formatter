import { z } from "zod";

export const PresetSchema = z.object({
  name: z.string().nullable(),
  removed: z.array(z.string()),
  added: z.array(z.record(z.string())),
  edited: z.array(z.record(z.string())),
  order: z.array(z.string()),
  export: z.enum(["csv", "txt"]),
  widths: z.array(z.record(z.number())),
  symbol: z.string(),
});

export type Preset = z.infer<typeof PresetSchema>;
