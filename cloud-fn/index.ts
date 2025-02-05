import { Storage } from "@google-cloud/storage";
import { BigQuery } from "@google-cloud/bigquery";
import { Preset } from "./common/types/schemas";
import { generateFileBuffers, parseBuffer } from "./common/lib/parser-fns";
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
        header=true,
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
    const parsedData = await parseBuffer({
      buffer,
      config: preset.parser
    });
    const processedData = applyPreset(parsedData, preset.changes);

    // Generate file buffers with error handling
    console.log('Generating file buffers...');
    const buffers = generateFileBuffers(processedData, preset);

    if (!buffers?.length) {
      console.error('No buffers generated', {
        processedData,
        preset: preset.name
      });
      return res.status(500).json({
        error: "File generation failed",
        details: "No output files were created"
      });
    }

    // Validate buffer structure
    const invalidBuffers = buffers.filter(b =>
        !b.name || !b.content || !(b.content instanceof Uint8Array)
    );

    if (invalidBuffers.length > 0) {
      console.error('Invalid buffer format', invalidBuffers);
      return res.status(500).json({
        error: "Invalid file format",
        details: "Generated buffers are malformed"
      });
    }

    // Save to GCS
    console.log(`Saving ${buffers.length} files to GCS...`);
    const destinationBucket = storage.bucket(body.destination);
    await Promise.all(
        buffers.map(async (buffer) => {
          try {
            await destinationBucket.file(buffer.name).save(buffer.content);
            console.log(`Saved ${buffer.name} successfully`);
          } catch (error) {
            console.error(`Failed to save ${buffer.name}`, error);
            throw error;
          }
        })
    );

    res.status(200).json({
      message: "Success",
      files: buffers.map(f => f.name),
      count: buffers.length
    });
  } catch (error) {
    console.error('Processing pipeline failed', error);
    res.status(500).json({
      error: "Processing failed",
      details: error instanceof Error ? error.message : "Unknown error",
      stack: process.env.NODE_ENV === 'development' && error instanceof Error
          ? error.stack
          : undefined
    });
  }
};