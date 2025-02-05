import Papa from "papaparse";
import { Options, parse, stringify } from "@evologi/fixed-width";
import { Data, DataProcessorParams, Preset, PresetSchema } from "../types/schemas";

const textDecoder = new TextDecoder();
const textEncoder = new TextEncoder();

export function parsePreset(buffer: Uint8Array): Preset {
  try {
    const loadedPreset = PresetSchema.parse(JSON.parse(textDecoder.decode(buffer)));
    localStorage.setItem(`preset_${loadedPreset.name}`, JSON.stringify(loadedPreset, null, 2));
    return loadedPreset;
  } catch (error) {
    console.log("Invalid Preset", { description: "Invalid preset file" });
    throw error;
  }
}

export async function parseFile(params: DataProcessorParams): Promise<Data> {
  const text = textDecoder.decode(params.buffer);

  if (params.config.format === "delimited") {
    return new Promise(resolve => Papa.parse(text, {
      skipEmptyLines: true,
      delimitersToGuess: ["~", "|"],
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
    const parseSection = (config: Options, ...lines: string[]) =>
        lines.length ? parse(lines.join("\n"), config) : [];

    return {
      header: params.config.header?.fields.length ? {
        fields: Object.keys(parseSection(params.config.header, lines.shift()!)[0]),
        rows: parseSection(params.config.header, lines[0]).map(Object.values)
      } : { fields: [], rows: [] },

      detail: {
        fields: Object.keys(parseSection(params.config.detail, ...lines)[0]),
        rows: parseSection(params.config.detail, ...lines).map(Object.values)
      },

      trailer: params.config.trailer?.fields.length ? {
        fields: Object.keys(parseSection(params.config.trailer, lines.pop()!)[0]),
        rows: parseSection(params.config.trailer, lines[0]).map(Object.values)
      } : { fields: [], rows: [] }
    };
  }

  throw new Error("Unsupported format");
}
export const formatData = (data: Data, preset: Preset) => {
  try {
    const groupTags = new Set(preset.output.groups.flatMap(g => g.tags));

    return Object.entries(data).reduce((acc, [tag, records]) => {
      if (!records.fields.length || !groupTags.has(tag)) return acc;

      acc[tag] = preset.format.format === "delimited"
          ? Papa.unparse({ fields: records.fields, data: records.rows }, {
            delimiter: preset.format.delimiter,
            skipEmptyLines: true
          })
          : stringify(
              records.rows.map(row => Object.fromEntries(
                  records.fields.map((f, i) => [f, row[i]])
              )), {
                pad: preset.format.pad,
                fields: records.fields.map(field => ({
                  property: field,
                  width: preset.format.widths[tag]?.[field] || 0,
                  align: preset.format.align
                }))
              }
          );
      return acc;
    }, {} as Record<string, string>);
  } catch (error) {
    console.log("Export Failed", { description: error.message });
  }
};

export const createFile = (data: Data, preset: Preset) => {
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