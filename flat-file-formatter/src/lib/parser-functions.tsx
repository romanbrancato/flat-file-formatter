import Papa from "papaparse";
import { Options, parse, stringify } from "@evologi/fixed-width";
import path from "node:path";
import { toast } from "sonner";
import { Preset } from "@/context/preset-context";
import { ConfigSchema } from "@/components/button-parser-config";
import { z } from "zod";

export type Data = {
  name: string;
  header: Record<string, unknown>[];
  detail: Record<string, unknown>[];
  trailer: Record<string, unknown>[];
};

export const ParserParams = z.object({
  file: z.instanceof(File),
  config: ConfigSchema,
});

export type ParserParams = z.infer<typeof ParserParams>;

export async function parseFile(params: ParserParams) {
  return new Promise<Data>((resolve, reject) => {
    if (params.config.format === "delimited") {
      const config: Papa.ParseLocalConfig<unknown, any> = {
        ...params.config,
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          resolve({
            name: path.parse(params.file.name).name,
            header: [{}],
            detail: results.data as Record<string, unknown>[],
            trailer: [{}],
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
          header:
            configHeader && configHeader?.fields.length > 0
              ? parse(headerRecord, configHeader as Options)
              : [{}],
          detail: parse(detailRecords, configDetail as Options),
          trailer:
            configTrailer && configTrailer?.fields.length > 0
              ? parse(trailerRecord, configTrailer as Options)
              : [{}],
        });
      };

      reader.readAsText(params.file);
    }
  });
}

export function unparseData(data: Data, preset: Preset) {
  try {
    if (preset.format === "delimited") {
      const config = {
        delimiter: preset.symbol,
        header: preset.label,
        skipEmptyLines: true,
      };
      return (
        Papa.unparse(data.header, config) +
        Papa.unparse(data.detail, config) +
        Papa.unparse(data.trailer, config)
      );
    } else {
      const headerConfig = Object.keys(data.header[0]).map((field) => {
        const width = preset.widths?.header?.[field];
        if (!width)
          throw new Error(`Width not found for header field: ${field}`);
        return {
          property: field,
          width: width,
          align: preset.align,
        };
      });

      const detailConfig = Object.keys(data.detail[0]).map((field) => {
        const width = preset.widths?.detail?.[field];
        if (!width)
          throw new Error(`Width not found for detail field: ${field}`);
        return {
          property: field,
          width: width,
          align: preset.align,
        };
      });

      const trailerConfig = Object.keys(data.trailer[0]).map((field) => {
        const width = preset.widths?.trailer?.[field];
        if (!width)
          throw new Error(`Width not found for trailer field: ${field}`);
        return {
          property: field,
          width: width,
          align: preset.align,
        };
      });

      return (
        // stringify(data.header, { pad: preset.symbol, fields: headerConfig }) +
        stringify(data.detail, { pad: preset.symbol, fields: detailConfig })
        // stringify(data.trailer, { pad: preset.symbol, fields: trailerConfig })
      );
    }
  } catch (error: any) {
    toast.error("Failed to Export File", { description: error.message });
    return;
  }
}
