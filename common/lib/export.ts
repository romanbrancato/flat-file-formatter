import { Format } from "../types/preset";
import { PGliteWithLive } from "@electric-sql/pglite/live";
import { Results } from "@electric-sql/pglite";
import Papa from "papaparse";
import { stringify } from "@evologi/fixed-width";

async function getExportQueryResults(
  db: PGliteWithLive,
  query: string
): Promise<Results> {
  if (!query) {
    throw new Error("Export query not defined");
  }
  return await db.query(query);
}

function formatExportQueryResults(
  results: Results,
  format: Format
): { name: string; dataString: string }[] {
  // Group rows by filename
  const grouped: Record<string, any[]> = {};

  results.rows.forEach((row) => {
    const filename = row.filename || "export";
    if (!grouped[filename]) grouped[filename] = [];
    grouped[filename].push(row.data);
  });

  // Prepare width config cache for fixed format
  const widthConfigCache = format.format === "fixed"
    ? Object.entries(format.widths).reduce((cache, [key, config]) => {
      if (config) {
        const sorted = Object.keys(config).sort().join(",");
        cache[sorted] = config;
      }
      return cache;
    }, {} as Record<string, any>)
    : null;

  // Process each file group
  return Object.entries(grouped).map(([filename, rows]) => {
    if (format.format === "delimited") {
      return {
        name: filename,
        dataString: Papa.unparse(rows, {
          header: !format.exclude_header,
          newline: "\r\n",
          delimiter: format.delimiter,
          skipEmptyLines: true
        })
      };
    }

    // Fixed width format
    const fixedString = rows.map(row => {
      const sortedKeys = Object.keys(row).sort().join(",");
      const config = widthConfigCache?.[sortedKeys];

      if (!config) {
        throw new Error(`No width config for columns: ${sortedKeys}`);
      }

      return stringify([row], {
        pad: format.pad,
        eol: "\r\n",
        fields: Object.entries(config).map(([field, width]) => ({
          property: field,
          width: width as number,
          align: format.align
        }))
      });
    }).join("");

    return { name: filename, dataString: fixedString };
  });
}

export async function handleExport(
  db: PGliteWithLive,
  query: string,
  format: Format
): Promise<{
  success: boolean;
  files?: { name: string; dataString: string }[];
  error?: string;
}> {
  try {
    return {
      success: true,
      files: formatExportQueryResults(
        await getExportQueryResults(db, query),
        format
      )
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred"
    };
  }
}
