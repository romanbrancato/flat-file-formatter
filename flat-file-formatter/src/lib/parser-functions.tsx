import Papa from "papaparse";
import { Options, parse, stringify } from "@evologi/fixed-width";
import path from "node:path";
import { toast } from "sonner";
import { z } from "zod";
import { Data, ParserConfigSchema, Preset } from "@/types/schemas";

export const ParserParams = z.object({
  file: z.instanceof(File),
  config: ParserConfigSchema,
});

export type ParserParams = z.infer<typeof ParserParams>;

export async function parseFile(params: ParserParams) {
  return new Promise<Data>((resolve, reject) => {
    switch (params.config.format) {
      case "delimited":
        const config: Papa.ParseLocalConfig<unknown, any> = {
          skipEmptyLines: true,
          complete: (results) => {
            const [fields, ...rows] = results.data as string[][];

            // Replace sole spaces with empty strings to avoid quoting issues in output
            const cleanedRows = rows.map((row: string[]) =>
              row.map((cell) => (cell.trim() === "" ? "" : cell.trim())),
            );

            resolve({
              name: path.parse(params.file.name).name,
              records: {
                detail: {
                  fields: fields,
                  rows: cleanedRows,
                },
              },
            });
          },
        };
        Papa.parse(params.file, config);
        break;

      case "fixed":
        const reader = new FileReader();
        const {
          header: configHeader,
          detail: configDetail,
          trailer: configTrailer,
        } = params.config;

        reader.onload = (event) => {
          const fileContents = event.target?.result as string;

          // Split the file contents into lines
          const lines = fileContents.split(/\r?\n/);

          // Find the header record
          let headerRecord = "";
          for (let i = 0; i < lines.length; i++) {
            if (lines[i] !== "") {
              headerRecord = lines[i];
              break;
            }
          }

          // Find the trailer record
          let trailerRecord = "";
          for (let j = lines.length - 1; j >= 0; j--) {
            if (lines[j] !== "") {
              trailerRecord = lines[j];
              break;
            }
          }

          // Collect detail records as a single string with new lines
          let detailRecords = "";
          for (
            let k = lines.indexOf(headerRecord) + 1;
            k < lines.lastIndexOf(trailerRecord);
            k++
          ) {
            if (lines[k] !== "") {
              detailRecords += lines[k] + "\n";
            }
          }

          resolve({
            name: path.parse(params.file.name).name,
            records: {
              header:
                configHeader && configHeader?.fields.length > 0
                  ? parse(headerRecord, configHeader as Options)
                  : [{}],
              detail: parse(detailRecords, configDetail as Options),
              trailer:
                configTrailer && configTrailer?.fields.length > 0
                  ? parse(trailerRecord, configTrailer as Options)
                  : [{}],
            },
          });
        };

        reader.readAsText(params.file);
    }
  });
}

export function unparseData(
  data: Data,
  preset: Preset,
): Record<string, string> | undefined {
  try {
    const flatData: Record<string, string> = {};

    Object.entries(data.records)
      .filter(([tag, records]) => records.fields.length > 0)
      .forEach(([tag, records]) => {
        flatData[tag] =
          preset.formatSpec.format === "delimited"
            ? Papa.unparse(
                { fields: records.fields, data: records.rows },
                {
                  delimiter: preset.formatSpec.delimiter,
                  skipEmptyLines: true,
                },
              )
            : preset.formatSpec.format === "fixed"
              ? stringify(
                  records.rows.map((row) =>
                    Object.fromEntries(
                      records.fields.map((field, index) => [field, row[index]]),
                    ),
                  ),
                  {
                    pad: preset.formatSpec.pad,
                    fields: records.fields.map((field) => {
                      const width =
                        preset.formatSpec.format === "fixed"
                          ? preset.formatSpec.widths[tag]?.[field]
                          : undefined;

                      if (!width) {
                        throw new Error(`No width found for ${field}`);
                      }

                      return {
                        property: field,
                        width: width,
                        align:
                          preset.formatSpec.format === "fixed"
                            ? preset.formatSpec.align
                            : "left",
                      };
                    }),
                  },
                )
              : "";
      });

    return flatData;
  } catch (error: any) {
    toast.error("Failed to Export File", { description: error.message });
  }
}
