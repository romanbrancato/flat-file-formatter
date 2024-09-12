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
    if (params.config.format === "delimited") {
      const config: Papa.ParseLocalConfig<unknown, any> = {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          resolve({
            name: path.parse(params.file.name).name,
            records: {
              header: [{}],
              detail: results.data as Record<string, string>[],
              trailer: [{}],
            },
          });
        },
      };
      Papa.parse(params.file, config);
    } else if (params.config.format === "fixed") {
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

export function unparseData(data: Data, preset: Preset): string[] | undefined {
  try {
    const arr: string[] = [];

    if (preset.formatSpec.format === "delimited") {
      const config = {
        delimiter: preset.formatSpec.delimiter,
        skipEmptyLines: true,
      };
      Object.keys(data.records).map((tag, record) =>
        arr.push(Papa.unparse(data.records[tag], config)),
      );
      return arr;
    }

    if (preset.formatSpec.format === "fixed") {
      Object.keys(data.records).forEach((tag) => {
        if (Object.keys(data.records[tag][0]).length === 0) {
          arr.push("");
        } else {
          const fields = Object.keys(data.records[tag][0]).map((key) => {
            let width = preset.formatSpec.widths[tag]?.[key];
            console.log(tag, key, width);
            if (!width) {
              throw new Error(`No width found for key ${key}`);
            }
            return {
              property: key,
              width: width,
              align: preset.formatSpec.align, // assuming alignment is left, adjust as needed
            };
          });

          arr.push(
            stringify(data.records[tag], {
              pad: " ",
              fields: fields,
            }),
          );
        }
      });
      return arr;
    }
  } catch (error: any) {
    toast.error("Failed to Export File", { description: error.message });
    return undefined;
  }
}
