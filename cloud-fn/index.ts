import { Storage } from "@google-cloud/storage";
import { BigQuery } from "@google-cloud/bigquery";
import { Preset } from "./common/types/schemas";
import { createFile, parseFile } from "./common/lib/parser-fns";
import { applyPreset } from "./common/lib/data-fns";
import { HttpFunction } from "@google-cloud/functions-framework";

interface RequestBody {
  query: string;
  preset: string;
  destination: string;
}

const storage = new Storage();

async function queryToBuffer(query: string): Promise<Uint8Array> {
  const bigquery = new BigQuery();
  const uuid = Math.random().toString(36).slice(2);
  const prefix = `exports/${uuid}_`;
  const gcsUri = `gs://file-destinations/${prefix}*.csv`;

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

  await job.getQueryResults();

  const bucket = storage.bucket('file-destinations');
  const [files] = await bucket.getFiles({ prefix });

  if (files.length === 0) {
    throw new Error('No files were exported.');
  }

  let combinedContent = '';
  for (const file of files) {
    const [buffer] = await file.download();
    combinedContent += buffer.toString('utf8');
  }

  // Convert to Uint8Array
  return new TextEncoder().encode(combinedContent);
}

export const bqExport: HttpFunction = async (req, res) => {
  try {
    const body = req.body as RequestBody;

    if (!body.query || !body.preset || !body.destination) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Load preset
    const presetBucket = storage.bucket("format-presets");
    const presetFile = presetBucket.file(`${body.preset}.json`);
    const [presetContent] = await presetFile.download();
    const preset: Preset = JSON.parse(presetContent.toString());

    // Process data
    const buffer = await queryToBuffer(body.query);
    const parsedData = await parseFile({
      buffer,
      config: preset.parser
    });
    const processedData = applyPreset(parsedData, preset.changes);

    // Create and save files
    const outputFiles = createFile(processedData, preset);
    if (!outputFiles?.length) {
      return res.status(333).json({ error: "Failed to create files" });
    }

    const destinationBucket = storage.bucket(body.destination);
    await Promise.all(outputFiles.map(async (file) => {
      await destinationBucket.file(file.name).save(file.content);
    }));

    res.status(200).json({
      message: "Success",
      files: outputFiles.map(f => f.name)
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Processing failed",
      details: error instanceof Error ? error.message : "Unknown error"
    });
  }
};