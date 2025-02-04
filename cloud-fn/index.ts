import { Storage } from "@google-cloud/storage";
import { BigQuery } from "@google-cloud/bigquery";
import { Data, Preset } from "./common/types/schemas";
import { createFile, parseFile } from "./common/lib/parser-fns";
import { applyPreset } from "./common/lib/data-fns";
import { HttpFunction } from "@google-cloud/functions-framework";

interface RequestBody {
  query: string;
  preset: string;
  destination: string;
}

const storage = new Storage();

async function queryToFile(query: string): Promise<File> {
  const bigquery = new BigQuery();

  // Unique prefix for the export
  const uuid = Math.random().toString(36).slice(2);
  const prefix = `exports/${uuid}_`;
  const gcsUri = `gs://file-destinations/${prefix}*.csv`; // Wildcard required

  // Step 1: Run the export job
  const [job] = await bigquery.createQueryJob({
    query: `
      EXPORT DATA OPTIONS(
        uri='${gcsUri}',
        format='CSV',
        overwrite=true
      ) AS ${query}
    `,
    location: 'US',
  });

  await job.getQueryResults(); // Wait for completion

  // Step 2: List and combine exported files
  const bucket = storage.bucket('file-destinations');
  const [files] = await bucket.getFiles({ prefix });

  if (files.length === 0) {
    throw new Error('No files were exported.');
  }

  // Download and concatenate all file contents
  let combinedContent = '';
  for (const file of files) {
    const [buffer] = await file.download();
    combinedContent += buffer.toString('utf8');
  }

  // Step 3: Create a single File object
  return new File([combinedContent], `results-${uuid}.csv`, {
    type: 'text/csv',
  });
}

export const bqExport: HttpFunction = async (req, res) => {
  try {

    const body = req.body as RequestBody;

    if (!body.query) {
      return res.status(400).json({
        error: "Missing required fields"
      });
    }

    const presetBucket = storage.bucket("format-presets");

    const presetFile = presetBucket.file(`${body.preset}.json`);
    const [presetContent] = await presetFile.download();
    const preset: Preset = JSON.parse(presetContent.toString());

    const file = await queryToFile(body.query);

    const data: Data = applyPreset(
      await parseFile({ file, config: preset.parser }),
      preset.changes,
    );

    const outputFile = createFile(data, preset);
    if (!outputFile) {
      return res.status(500).json({
        error: "Failed to create file",
        details: "Unknown error",
      });
    }

    await storage
      .bucket(body.destination)
      .file(outputFile.name)
      .save(Buffer.from(await outputFile.arrayBuffer()));

    res.status(200).send("OK");
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Failed to process request",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
