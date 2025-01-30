import { HttpFunction } from "@google-cloud/functions-framework";
import { Storage } from "@google-cloud/storage";
import { BigQuery } from "@google-cloud/bigquery";
import { Data, Preset } from "./types/schemas";
import { createFile, parseFile } from "./lib/parser-functions";
import { applyPreset } from "./lib/data-functions";

interface RequestBody {
  query: string;
  presetName: string;
  destination: string;
}

async function queryToFile(query: string): Promise<File> {
  const bigquery = new BigQuery();

  const [job] = await bigquery.createQueryJob({
    query: query,
    location: "US",
  });

  const [rows] = await job.getQueryResults();

  const schema = job.metadata.schema;

  const headers: string[] = schema.fields.map(
    (field: { name: string }) => field.name,
  );

  const csvString = [
    headers.join(","),
    ...rows.map((row: any) => headers.map((header) => row[header]).join(",")),
  ].join("\n");

  return new File([csvString], "query-results.csv", {
    type: "text/csv",
  });
}

export const bqExport: HttpFunction = async (req, res) => {
  try {
    const body = req.body as RequestBody;

    if (!body.query) {
      return res.status(400).json({
        error: "Missing required fields",
        details: "Query and destination are required",
      });
    }

    const storage = new Storage();

    const presetBucket = storage.bucket("format-presets");

    const presetFile = presetBucket.file(`${body.presetName}.json`);
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
    res.status(500).json({
      error: "Failed to process request",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
