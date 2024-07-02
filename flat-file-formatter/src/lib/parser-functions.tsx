import Papa from "papaparse";
import {Options, parse} from "@evologi/fixed-width";

export type ParserParams = {
    file: File;
    format: "delimited";
    config: Omit<Papa.ParseLocalConfig<unknown, any>, "complete">;
} | {
    file: File;
    format: "fixed";
    config: Options;
};

export async function parseFile(params: ParserParams) {
    return new Promise<Record<string, unknown>[]>((resolve, reject) => {
        if (params.format === "delimited") {
            const config: Papa.ParseLocalConfig<unknown, any> = {
                ...params.config,
                complete: (results) => {
                    resolve(results.data as Record<string, unknown>[]);
                }
            };
            Papa.parse(params.file, config);
        } else {
            const reader = new FileReader();
            reader.onload = (event) => {
                const fileContents = event.target?.result as string;
                resolve(parse(fileContents, params.config));
            };
            reader.readAsText(params.file);
        }
    });
}