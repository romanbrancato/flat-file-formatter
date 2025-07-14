import { LoadConfig } from "@common/types/preset";
import { Transaction } from "@electric-sql/pglite";
import { PGliteWithLive } from "@electric-sql/pglite/live";
import { parse } from "@evologi/fixed-width";
import Papa from "papaparse";

function skipRows(dataString: string, skipRows: string): string {
  const lines = dataString.trim().split(/\r?\n/).filter(Boolean);
  const rowsToSkip = new Set<number>();

  for (const part of skipRows.split(",").map(p => p.trim())) {
    if (part.includes(":")) {
      const [startStr, endStr] = part.split(":").map(p => p.trim());
      const start = parseInt(startStr), end = parseInt(endStr);
      const startIndex = start < 0 ? lines.length + start : start;
      const endIndex = end < 0 ? lines.length + end : end;

      for (let i = Math.min(startIndex, endIndex); i <= Math.max(startIndex, endIndex); i++) {
        rowsToSkip.add(i);
      }
    } else {
      const index = parseInt(part);
      const actualIndex = index < 0 ? lines.length + index : index;
      if (!isNaN(index) && actualIndex >= 0 && actualIndex < lines.length) {
        rowsToSkip.add(actualIndex);
      }
    }
  }

  return lines.filter((_, index) => !rowsToSkip.has(index)).join("\n");
}

async function createAndPopulateTable(
  tx: Transaction,
  tableName: string,
  fields: string[],
  data: any[]
): Promise<void> {

  // Drop table if it already exists
  await tx.query(`DROP TABLE IF EXISTS "${tableName}"`);

  // Create table with appropriate schema
  await tx.query(`
    CREATE TABLE "${tableName}" (
      ${fields.map(f => `"${f}" VARCHAR`).join(", ")}
    )
  `);

  // Insert data
  for (const row of data) {
    const values = fields
      .map((_, index) => {
        const value = row[index] ?? row[Object.keys(row)[index]];
        return value === null || value === undefined || value === ""
          ? "NULL"
          : `'${String(value).replace(/'/g, "''")}'`;
      })
      .join(", ");

    await tx.query(`
      INSERT INTO "${tableName}" (${fields.map(f => `"${f}"`).join(", ")})
      VALUES (${values})
    `);
  }
}

export async function loadDataIntoTable(
  fileData: Uint8Array,
  db: PGliteWithLive,
  config: LoadConfig
): Promise<{ success: boolean; error?: string }> {
  try {
    const dataString = new TextDecoder().decode(fileData);
    const processedString = config.skipRows ? skipRows(dataString, config.skipRows) : dataString;

    let data: any[] = [];
    let fields: string[] = [];

    // Parse data based on format
    if (config.format === "delimited") {
      // First parse: Get rows as arrays (without header processing)
      const nonHeaderResult = Papa.parse(processedString, {
        header: false,
        skipEmptyLines: true,
        delimiter: config.delimiter,
        transform: value => value.trim()
      });

      if (nonHeaderResult.errors.length > 0) {
        throw new Error(`Parsing error: ${nonHeaderResult.errors[0].message}`);
      }

      const rows = nonHeaderResult.data;

      if (rows.length === 0) {
        data = [];
        fields = [];
      } else {
        // Determine maximum column count from all rows
        const columnCount = Math.max(...rows.map(row => row.length));

        // Pad all rows to match columnCount
        const paddedRows = rows.map(row => {
          const padding = Array(columnCount - row.length).fill('');
          return [...row, ...padding];
        });

        // Extract header and data rows
        fields = paddedRows[0];
        data = paddedRows.slice(1).map(row => {
          const obj = {};
          fields.forEach((field, i) => {
            obj[field] = row[i] || '';
          });
          return obj;
        });
      }

    } else if (config.format === "fixed") {
      data = parse(processedString, config.widths);
      fields = config.widths.fields.map(f => f.property);

    } else {
      throw new Error(`Unsupported format`);
    }

    if (!data.length) throw new Error("No data found in file");

    // Wrap operations in a transaction
    await db.transaction(async (tx) => {
      await createAndPopulateTable(tx, config.tablename, fields, data);
    });

    return { success: true };

  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred"
    };
  }
}
