import { LoadConfig } from "@common/types/schemas";
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

function normalizeColumnNames(fields: string[]): string[] {
  const seenColumns = new Set<string>();

  return fields.map(field => {
    const normalized = field.toLowerCase()
      .replace(/[^a-z0-9]+/g, "_")
      .replace(/^_+|_+$/g, "") || "column";
    
    let uniqueName = normalized;
    let counter = 0;
    
    while (seenColumns.has(uniqueName)) {
      uniqueName = `${normalized}_${++counter}`;
    }
    
    seenColumns.add(uniqueName);
    return uniqueName;
  });
}

async function createAndPopulateTable(
  db: PGliteWithLive,
  tableName: string,
  fields: string[],
  data: any[],
  serialPrimaryKey: string
): Promise<void> {
  const containsPrimaryKey = fields.includes(serialPrimaryKey);
  
  // Create table with appropriate schema
  await db.query(`
    CREATE TABLE ${tableName} (
      ${containsPrimaryKey ? '' : `${serialPrimaryKey} SERIAL PRIMARY KEY,`}
      ${fields.map(f => `${f} TEXT`).join(", ")}
    )
  `);
  
  // Add primary key constraint if using existing column
  if (containsPrimaryKey) {
    await db.query(`
      ALTER TABLE ${tableName}
      ADD PRIMARY KEY (${serialPrimaryKey})
    `);
  }

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

    await db.query(`
      INSERT INTO ${tableName} (${fields.join(", ")})
      VALUES (${values})
    `);
  }
}

export async function loadDataIntoTable(
  fileData: Uint8Array,
  db: PGliteWithLive,
  config: LoadConfig
): Promise<{ success: boolean; table?: string; error?: string }> {
  try {
    const dataString = new TextDecoder().decode(fileData);
    const processedString = config.skipRows ? skipRows(dataString, config.skipRows) : dataString;
    const serialPK = config.serialPrimaryKey || "id";
    
    let data: any[] = [];
    let fields: string[] = [];
    
    // Parse data based on format
    if (config.format === "delimited") {
      const result = Papa.parse(processedString, {
        header: true,
        skipEmptyLines: true,
        delimiter: config.delimiter,
        transform: value => value.trim(),
      });
      
      if (result.errors.length > 0) {
        throw new Error(`Parsing error: ${result.errors[0].message}`);
      }
      
      data = result.data;
      fields = normalizeColumnNames(result.meta.fields || []);
      
    } else if (config.format === "fixed") {
      data = parse(processedString, config.widths);
      fields = normalizeColumnNames(config.widths.fields.map(f => f.property));
      
    } else {
      throw new Error(`Unsupported format`);
    }
    
    if (!data.length) throw new Error("No data found in file");
    
    await createAndPopulateTable(db, config.name, fields, data, serialPK);
    return { success: true, table: config.name };
    
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}