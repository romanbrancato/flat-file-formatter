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

export function unparseData(data: Data, preset: Preset) {
  try {
    if (preset.formatSpec.format === "delimited") {
      const config = {
        delimiter: preset.formatSpec.delimiter,
        skipEmptyLines: true,
      };
      return (
        Papa.unparse(data.header, config) +
        Papa.unparse(data.detail, config) +
        Papa.unparse(data.trailer, config)
      );
    }

    if (preset.formatSpec.format === "fixed") {
      const createConfig = (
        flag: "header" | "detail" | "trailer",
        widths: Record<string, number>,
        align: "left" | "right",
      ) => {
        return Object.keys(data[flag][0]).map((field) => {
          const width = widths?.[field];
          if (!width)
            throw new Error(`Width not found for ${flag} field: ${field}`);
          return {
            property: field,
            width: width,
            align: align,
          };
        });
      };

      return (
        stringify(data.header, {
          pad: preset.formatSpec.pad,
          fields: createConfig(
            "header",
            preset.formatSpec.widths.header,
            preset.formatSpec.align,
          ),
        }) +
        stringify(data.detail, {
          pad: preset.formatSpec.pad,
          fields: createConfig(
            "detail",
            preset.formatSpec.widths.detail,
            preset.formatSpec.align,
          ),
        }) +
        stringify(data.trailer, {
          pad: preset.formatSpec.pad,
          fields: createConfig(
            "trailer",
            preset.formatSpec.widths.trailer,
            preset.formatSpec.align,
          ),
        })
      );
    }
  } catch (error: any) {
    toast.error("Failed to Export File", { description: error.message });
    return;
  }
}
