import Papa from "papaparse";
import { Options, parse, stringify } from "@evologi/fixed-width";
import { Data, DataProcessorParams, Preset, PresetSchema } from "../types/schemas";

const textDecoder = new TextDecoder();
const textEncoder = new TextEncoder();

export function parsePreset(buffer: Uint8Array): Preset {
  try {
    return PresetSchema.parse(JSON.parse(textDecoder.decode(buffer)));
  } catch (error) {
    console.log("Invalid Preset", { description: "Invalid preset file" });
    throw error;
  }
}

export async function parseBuffer(params: DataProcessorParams): Promise<Data> {
  const text = textDecoder.decode(params.buffer);

  if (params.config.format === "delimited") {
    return new Promise(resolve => Papa.parse(text, {
      skipEmptyLines: true,
      delimiter: params.config.format === "delimited" ? params.config.delimiter : "",
      complete: ({ data }) => resolve({
        detail: {
          fields: (data[0] as string[]).map(f => f.trim()),
          rows: data.slice(1).map(row => (row as string[]).map(cell => cell.trim()))
        }
      })
    }));
  }

  if (params.config.format === "fixed") {
    const lines = text.split(/\r?\n/).filter(Boolean);
    const parseSection = (config: Options, ...lines: string[]) => {
      const result = parse(lines.join("\n"), config);
      return result as Record<string, string>[]; // Add type assertion
    };

    if (params.config.format === "fixed") {
      return {
        header: params.config.header?.fields.length ? {
          fields: Object.keys(parseSection(params.config.header, lines.shift()!)[0]),
          rows: parseSection(params.config.header, lines[0]).map(row => Object.values(row))
        } : { fields: [], rows: [] },

        detail: {
          fields: Object.keys(parseSection(params.config.detail, ...lines)[0]),
          rows: parseSection(params.config.detail, ...lines).map(row => Object.values(row))
        },

        trailer: params.config.trailer?.fields.length ? {
          fields: Object.keys(parseSection(params.config.trailer, lines.pop()!)[0]),
          rows: parseSection(params.config.trailer, lines[0]).map(row => Object.values(row))
        } : { fields: [], rows: [] }
      };
    }
  }

  throw new Error("Unsupported format");
}

export function formatData(
    data: Data,
    preset: Preset
): Record<string, string> | undefined {
  try {
    const flatData: Record<string, string> = {};
    const groupTags = new Set(preset.output.groups.flatMap(g => g.tags));

    Object.entries(data).forEach(([tag, records]) => {
      if (!records.fields.length || !groupTags.has(tag)) return;

      if (preset.format.format === "fixed") {
        flatData[tag] = stringify(
            records.rows.map(row =>
                Object.fromEntries(
                    records.fields.map((field, index) => [field, row[index]])
                )
            ), {
              pad: preset.format.pad,
              fields: records.fields.map(field => {
                if (preset.format.format !== "fixed") throw new Error("Invalid format");
                const width = preset.format.widths[tag]?.[field];
                if (!width || width <= 0) throw new Error(`Invalid width for ${field}`);
                return {
                  property: field,
                  width: width,
                  align: preset.format.align
                };
              })
            }
        );
      } else if (preset.format.format === "delimited") {
        flatData[tag] = Papa.unparse({
          fields: records.fields,
          data: records.rows
        }, {
          delimiter: preset.format.delimiter,
          skipEmptyLines: true
        });
      }
    });

    return flatData;
  } catch (error: unknown) {
    console.log("Export Failed", {
      description: error instanceof Error ? error.message : "Unknown error"
    });
  }
}

export const generateFileBuffers = (data: Data, preset: Preset) => {
  const flatData = formatData(data, preset);
  return flatData && preset.output.groups.map(group => {
    const content = group.ordering === "round robin"
        ? Array.from({ length: Math.max(...group.tags.map(t =>
              (flatData[t]?.split("\n") || []).length)) }, (_, i) =>
            group.tags.map(t => flatData[t]?.split("\n")[i]).filter(Boolean).join("\n")
        ).join("\n")
        : group.tags.map(t => flatData[t]?.trim()).filter(Boolean).join("\n");

    return {
      name: group.name,
      content: textEncoder.encode(content.replace(/\n/g, "\r\n"))
    };
  });
};