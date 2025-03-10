import { Export, Format } from "../types/schemas";
import { PGliteWithLive } from "@electric-sql/pglite/live";
import { Results } from "@electric-sql/pglite";
import Papa from "papaparse";
import { stringify } from "@evologi/fixed-width";

async function getExportQueryResults<T>(
  db: PGliteWithLive,
  config: Export,
): Promise<{ name: string; res: Results<T> }[]> {
  if (!config.files || config.files.length === 0) {
    throw new Error("No export files specified");
  }

  const promises = config.files.map(async (query) => {
    return {
      name: query.filename,
      res: await db.query<T>(query.query),
    };
  });

  // Wait for all promises to resolve
  return Promise.all(promises);
}

function formatExportQueryResults<T>(
    results: { name: string; res: Results<T> }[],
    format: Format,
  ): { name: string; dataString: string }[] {
    const formattedData: { name: string; dataString: string }[] = [];
    
    results.forEach((result) => {
      // Extract the row_data from each row object
      const dataToFormat = result.res.rows.map((row: any) => row.row_data);
  
      if (format.format === "delimited") {
        const csvString = Papa.unparse(dataToFormat, { // Use the extracted row_data
          delimiter: format.delimiter,
          skipEmptyLines: true,
        });
        formattedData.push({ name: result.name, dataString: csvString });
      } else if (format.format === "fixed") {
        const fixedString = stringify(dataToFormat, { // Use the extracted row_data
          pad: format.pad,
          fields: Object.entries(format.widths[result.name] || {}).map(([field, width]) => {
            if (!width || width <= 0)
              throw new Error(`Invalid width for ${field}`);
            return {
              property: field,
              width: width,
              align: format.align,
            };
          }),
        });
        formattedData.push({ name: result.name, dataString: fixedString });
      }
    });
  
    return formattedData;
  }

export async function handleExport(
  db: PGliteWithLive,
  config: Export,
  format: Format,
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
        format,
      ),
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}
