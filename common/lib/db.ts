import { PGliteWithLive } from "@electric-sql/pglite/live";
import { identifier, raw } from '@electric-sql/pglite/template';
import Papa from "papaparse";

export async function loadCSVIntoTable(
  csvData: Uint8Array, 
  tableName: string, 
  db: PGliteWithLive
): Promise<{ success: boolean; error?: string }> {
  try {
    // Convert Uint8Array to string
    const csvString = new TextDecoder().decode(csvData);

    // Parse CSV using PapaParse
    const parseResult = Papa.parse(csvString, {
      header: true,
      skipEmptyLines: true,
      transform: (value) => value.trim(),
    });

    if (parseResult.errors.length > 0) {
      throw new Error(`CSV parsing error: ${parseResult.errors[0].message}`);
    }

    const { data, meta } = parseResult;
    if (!data.length) {
      throw new Error('No data found in CSV');
    }

    // Create table with all columns as TEXT
    const columns = meta.fields!.map(field => 
      `${field} TEXT`
    ).join(', ');

    // Drop existing table if it exists and create new one
     await db.sql`DROP TABLE IF EXISTS ${identifier`${tableName}`}`;
     await db.sql`CREATE TABLE ${identifier`${tableName}`} (${raw`${columns}`})`;

    // Insert data row by row using parameterized queries
    for (const row of data) {
      const values = meta.fields!.map(field => {
        const value = row[field];
        return value === null || value === undefined || value === '' 
          ? 'NULL' 
          : `'${String(value).replace(/'/g, "''")}'`; // Escape single quotes
      }).join(', ');

      const columnNames = meta.fields!.map(field =>`${field}`).join(', ');
      
      await db.sql`
        INSERT INTO ${identifier`${tableName}`} (${raw`${columnNames}`})
        VALUES (${raw`${values}`})
      `;
    }

    return { success: true };

  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}