import Papa from "papaparse";
import { Options, parse, stringify } from "@evologi/fixed-width";
import { toast } from "sonner";
import { Data, Preset } from "@/types/schemas";
import { download, tokenize } from "@/lib/utils";
import { ParserParams } from "@/hooks/useParser";

export async function parseFile(params: ParserParams) {
  return new Promise<Data>((resolve, reject) => {
    switch (params.config.format) {
      case "delimited": {
        const config: Papa.ParseLocalConfig<unknown, any> = {
          skipEmptyLines: true,
          delimitersToGuess: ["~", "|"],
          complete: (results) => {
            const [fields, ...rows] = results.data as string[][];

            const trimmedFields = fields.map((field) => field.trim());

            const trimmedRows = rows.map((row) =>
              row.map((cell) => cell.trim()),
            );

            resolve({
              records: {
                detail: {
                  fields: trimmedFields,
                  rows: trimmedRows,
                },
              },
            });
          },
        };
        Papa.parse(params.file, config);
        break;
      }

      case "fixed": {
        const reader = new FileReader();

        reader.onload = (event) => {
          if (params.config.format !== "fixed") return;

          const fileContents = event.target?.result as string;
          const lines = fileContents.split(/\r?\n/).filter(Boolean);

          const records: Record<
            string,
            { fields: string[]; rows: string[][] }
          > = {
            header: { fields: [], rows: [] },
            detail: { fields: [], rows: [] },
            trailer: { fields: [], rows: [] },
          };

          const unzip = (parsedData: { [key: string]: any }[]) => {
            if (!parsedData || parsedData.length === 0)
              return { fields: [], rows: [] };
            const fields = Object.keys(parsedData[0]);
            const rows = parsedData.map((row) =>
              fields.map((field) => row[field]),
            );
            return { fields, rows };
          };

          if (params.config.header?.fields.length) {
            records.header = unzip(
              parse(lines[0], params.config.header as Options),
            );
            lines.splice(0, 1);
          }

          if (params.config.trailer?.fields.length) {
            records.trailer = unzip(
              parse(lines.pop() as string, params.config.trailer as Options),
            );
          }

          if (params.config.detail?.fields.length) {
            records.detail = unzip(
              parse(lines.join("\n"), params.config.detail as Options),
            );
          }

          resolve({
            records,
          });
        };

        reader.readAsText(params.file);
        break;
      }

      default:
        reject(new Error("Unsupported format"));
    }
  });
}

export function unparseData(
  data: Data,
  preset: Preset,
): Record<string, string> | undefined {
  try {
    const flatData: Record<string, string> = {};

    const groupTags = new Set(
      preset.output.groups.flatMap((group) => group.tags),
    );

    Object.entries(data.records)
      .filter(
        ([tag, records]) => records.fields.length > 0 && groupTags.has(tag),
      )
      .forEach(([tag, records]) => {
        flatData[tag] =
          preset.output.details.format === "delimited"
            ? Papa.unparse(
                { fields: records.fields, data: records.rows },
                {
                  delimiter: preset.output.details.delimiter,
                  skipEmptyLines: true,
                },
              )
            : preset.output.details.format === "fixed"
              ? stringify(
                  records.rows.map((row) =>
                    Object.fromEntries(
                      records.fields.map((field, index) => [field, row[index]]),
                    ),
                  ),
                  {
                    pad: preset.output.details.pad,
                    fields: records.fields.map((field) => {
                      const width =
                        preset.output.details.format === "fixed"
                          ? preset.output.details.widths[tag]?.[field]
                          : undefined;

                      if (!width || width <= 0) {
                        throw new Error(`Invalid width for ${field}`);
                      }

                      return {
                        property: field,
                        width: width,
                        align:
                          preset.output.details.format === "fixed"
                            ? preset.output.details.align
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

export function exportFile(data: Data, preset: Preset, name: string) {
  const flatData = unparseData(data, preset);
  if (!flatData) return;

  const tokenizedName = tokenize(name);

  preset.output.groups.forEach((group) => {
    let content = "";

    switch (group.ordering) {
      case "in order":
        content = group.tags
          .map((tag) => flatData[tag]?.trim())
          .filter(Boolean)
          .join("\n");
        break;

      case "round robin": {
        const tagData = group.tags.map(
          (tag) => flatData[tag]?.split("\n") || [],
        );
        const maxLength = Math.max(...tagData.map((rows) => rows.length));

        content = Array.from({ length: maxLength }, (_, i) =>
          group.tags
            .map((tag, index) => tagData[index][i])
            .filter(Boolean)
            .join("\n"),
        ).join("\n");
        break;
      }

      default:
        break;
    }

    download(
      content.replace(/\n/g, "\r\n"),
      group.name.replace(
        /{(\d+)}/g,
        (match, index) => tokenizedName[index] || "",
      ),
      "txt",
    );
  });
}
