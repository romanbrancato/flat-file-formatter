import { Export, Format } from "../types/preset";
import { PGliteWithLive } from "@electric-sql/pglite/live";
import { Results } from "@electric-sql/pglite";
import Papa from "papaparse";
import { stringify } from "@evologi/fixed-width";

async function getExportQueryResults<T>(
  db: PGliteWithLive,
  config: Export
): Promise<{ name: string; res: Results<T> }[]> {
  if (!config.files || config.files.length === 0) {
    throw new Error("No export files specified");
  }

  const promises = config.files.map(async (query) => {
    return {
      name: query.filename,
      res: await db.query<T>(query.query)
    };
  });

  // Wait for all promises to resolve
  return Promise.all(promises);
}

function formatExportQueryResults<T>(
  results: { name: string; res: Results<T> }[],
  format: Format
): { name: string; dataString: string }[] {
  const formattedData: { name: string; dataString: string }[] = [];

  results.forEach((result) => {
    const rows = result.res.rows.map((row: any) => row.row_data);

    if (format.format === "delimited") {
      const csvLines: string[] = [];
      rows.forEach((row) => {
        const csvLine = Papa.unparse([row], {
          header: false,
          delimiter: format.delimiter,
          skipEmptyLines: true
        });
        csvLines.push(csvLine);
      });
      const csvString = csvLines.join("\r\n");
      formattedData.push({ name: result.name, dataString: csvString });
    } else if (format.format === "fixed") {
      const fixedLines: string[] = [];

      rows.forEach((row) => {
        const sortedRowKeys = Object.keys(row).sort().join(',');
        let matchedWidthKey: string | null = null;

        // Find exact matching width configuration for the row
        for (const [widthKey, widthConfig] of Object.entries(format.widths)) {
          if (!widthConfig) continue;

          const sortedConfigKeys = Object.keys(widthConfig).sort().join(',');

          // String comparison to check if the row's columns match the width configuration
          if (sortedRowKeys === sortedConfigKeys) {
            matchedWidthKey = widthKey;
            break; // Found exact match, no need to continue
          }
        }

        if (!matchedWidthKey) {
          throw new Error(
            "No width configuration matches the row's columns"
          );
        }

        const widthsForRecord = format.widths[matchedWidthKey];
        const fixedLine = stringify([row], {
          pad: format.pad,
          eol: "\r\n",
          fields: Object.entries(widthsForRecord!).map(([field, width]) => {
            if (typeof width !== "number" || width <= 0) {
              throw new Error(`Invalid width for ${field}`);
            }
            return {
              property: field,
              width: width,
              align: format.align
            };
          })
        });

        fixedLines.push(fixedLine);
      });

      const fixedString = fixedLines.join("");
      formattedData.push({ name: result.name, dataString: fixedString });
    }
  });

  return formattedData;
}

export async function handleExport(
  db: PGliteWithLive,
  config: Export,
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
        await getExportQueryResults(db, config),
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
