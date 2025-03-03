import { stringify } from "@evologi/fixed-width";
import Papa from "papaparse";
import { Preset, PresetSchema } from "../types/schemas";

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