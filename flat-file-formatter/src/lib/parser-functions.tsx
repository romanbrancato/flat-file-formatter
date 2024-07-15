import Papa from "papaparse";
import { Options, parse, stringify } from "@evologi/fixed-width";
import path from "node:path";
import { toast } from "sonner";
import { Preset } from "@/context/preset-context";

export type Data = {
  name: string;
  header: Record<string, unknown>[];
  detail: Record<string, unknown>[];
  trailer: Record<string, unknown>[];
};

export type MultiFormatConfig =
  | ({
      format: "delimited";
    } & Omit<Papa.ParseLocalConfig<unknown, any>, "complete">)
  | ({
      format: "fixed";
    } & Options);

export type ParserParams = {
  file: File;
  config: MultiFormatConfig;
};

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
      reader.onload = (event) => {
        const fileContents = event.target?.result as string;
        resolve({
          name: path.parse(params.file.name).name,
          header: [{}],
          detail: parse(fileContents, params.config as Options),
          trailer: [{}],
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
        stringify(data.header, { pad: preset.symbol, fields: headerConfig }) +
        stringify(data.detail, { pad: preset.symbol, fields: detailConfig }) +
        stringify(data.trailer, { pad: preset.symbol, fields: trailerConfig })
      );
    }
  } catch (error: any) {
    toast.error("Failed to Export File", { description: error.message });
    return;
  }
}
