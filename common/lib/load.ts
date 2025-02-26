import { LoadConfig } from "@common/types/schemas";
import { PGliteWithLive } from "@electric-sql/pglite/live";
import { identifier, raw } from "@electric-sql/pglite/template";
import { parse } from "@evologi/fixed-width";
import Papa from "papaparse";

function skipRows(dataString: string, skipRows: string): string {
  const lines = dataString.trim().split(/\r?\n/).filter(Boolean);
  const rowsToSkip = new Set<number>();

  for (const part of skipRows.split(",").map((p) => p.trim())) {
    if (part.includes(":")) {
      const [startStr, endStr] = part.split(":").map((p) => p.trim());
      const start = parseInt(startStr),
        end = parseInt(endStr);

      const startIndex = start < 0 ? lines.length + start : start;
      const endIndex = end < 0 ? lines.length + end : end;

      for (
        let i = Math.min(startIndex, endIndex);
        i <= Math.max(startIndex, endIndex);
        i++
      ) {
        rowsToSkip.add(i);
      }
    } else {
      const index = parseInt(part);
      if (!isNaN(index)) {
        const actualIndex = index < 0 ? lines.length + index : index;
        if (actualIndex >= 0 && actualIndex < lines.length) {
          rowsToSkip.add(actualIndex);
        }
      }
    }
  }

  return lines.filter((_, index) => !rowsToSkip.has(index)).join("\n");
}

function generateUniqueName(
  name: string,
  seenColumns: Set<string>,
  counter = 0,
): string {
  const newName = counter === 0 ? name : `${name}_${counter}`;
  return seenColumns.has(newName)
    ? generateUniqueName(name, seenColumns, counter + 1)
    : newName;
}

function normalizeColumnName(name: string): string {
  return (
    name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "_")
      .replace(/^_+|_+$/g, "") || "column"
  );
}

async function createAndPopulateTable(
  db: PGliteWithLive,
  tableName: string,
  transformedFields: string[],
  data: any[],
): Promise<void> {
  // Create table
  await db.sql`DROP TABLE IF EXISTS ${identifier`${tableName}`}`;
  await db.sql`CREATE TABLE ${identifier`${tableName}`} (${raw`${transformedFields.map((f) => `${f} TEXT`).join(", ")}`})`;

  // Insert data
  for (const row of data) {
    const values = transformedFields
      .map((field, index) => {
        const value = row[index] ?? row[Object.keys(row)[index]];
        return value === null || value === undefined || value === ""
          ? "NULL"
          : `'${String(value).replace(/'/g, "''")}'`;
      })
      .join(", ");

    await db.sql`
      INSERT INTO ${identifier`${tableName}`} (${raw`${transformedFields.join(", ")}`})
      VALUES (${raw`${values}`})
    `;
  }
}

export async function loadCSVIntoTable(
  csvData: Uint8Array,
  db: PGliteWithLive,
  config: LoadConfig,
): Promise<{ success: boolean; table?: string; error?: string }> {
  try {
    const csvString = new TextDecoder().decode(csvData);
    const processedCsvString = config.skipRows
      ? skipRows(csvString, config.skipRows)
      : csvString;

    const { data, meta, errors } = Papa.parse(processedCsvString, {
      header: true,
      skipEmptyLines: true,
      transform: (value) => value.trim(),
    });

    if (errors.length > 0)
      throw new Error(`CSV parsing error: ${errors[0].message}`);
    if (!data.length) throw new Error("No data found in CSV");

    // Process column names
    const seenColumns = new Set<string>();
    const transformedFields = meta.fields!.map((field) =>
      generateUniqueName(normalizeColumnName(field), seenColumns),
    );

    await createAndPopulateTable(db, config.name, transformedFields, data);
    return { success: true, table: config.name };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}

export async function loadFixedIntoTable(
  fixedData: Uint8Array,
  db: PGliteWithLive,
  config: LoadConfig,
): Promise<{ success: boolean; table?: string; error?: string }> {
  try {
    if (config.format !== "fixed") throw new Error("Unsupported format");

    const fixedString = new TextDecoder().decode(fixedData);
    const processedFixedString = config.skipRows
      ? skipRows(fixedString, config.skipRows)
      : fixedString;

    const data = parse(processedFixedString, config.widths);
    if (!data.length) throw new Error("No data found in file");

    // Process column names
    const seenColumns = new Set<string>();
    const transformedFields = config.widths.fields.map((field) =>
      generateUniqueName(normalizeColumnName(field.property), seenColumns),
    );

    await createAndPopulateTable(db, config.name, transformedFields, data);
    return { success: true, table: config.name };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}
