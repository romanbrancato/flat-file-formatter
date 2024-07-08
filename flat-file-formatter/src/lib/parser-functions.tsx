import Papa from "papaparse";
import { Options, parse } from "@evologi/fixed-width";
import path from "node:path";

export type Data = {
  name: string;
  rows: Record<string, unknown>[];
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
            rows: results.data as Record<string, unknown>[],
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
          rows: parse(fileContents, params.config as Options),
        });
      };
      reader.readAsText(params.file);
    }
  });
}
