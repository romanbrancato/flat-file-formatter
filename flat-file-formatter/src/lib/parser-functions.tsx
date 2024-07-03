import Papa from "papaparse";
import {Options, parse} from "@evologi/fixed-width";

export type MultiFormatConfig = ({
    format: "delimited";
} & Omit<Papa.ParseLocalConfig<unknown, any>, "complete">) | ({
    format: "fixed";
} & Options);

export type ParserParams = {
    file: File;
    config: MultiFormatConfig
}

export async function parseFile(params: ParserParams) {
    return new Promise<Record<string, unknown>[]>((resolve, reject) => {
        if (params.config.format === "delimited") {
            const config: Papa.ParseLocalConfig<unknown, any> = {
                ...params.config,
                complete: (results) => {
                    resolve(results.data as Record<string, unknown>[]);
                }
            };
            Papa.parse(params.file, config);
        } else if(params.config.format === "fixed") {
            const reader = new FileReader();
            reader.onload = (event) => {
                const fileContents = event.target?.result as string;
                resolve(parse(fileContents, params.config as Options));
            };
            reader.readAsText(params.file);
        }
    });
}