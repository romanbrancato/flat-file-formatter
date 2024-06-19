import { z } from "zod";

export const DataSchema = z.object({
  name: z.string().nullable(),
  headers: z.array(z.string()),
  values: z.array(z.record(z.string())),
});

export type Data = z.infer<typeof DataSchema>;
