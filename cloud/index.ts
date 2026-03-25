import { http } from "@google-cloud/functions-framework";
import { PGlite } from "@electric-sql/pglite";
import type { PGliteWithLive } from "@electric-sql/pglite/live";
import { Storage } from "@google-cloud/storage";
import { loadPresetFromFile, runQueriesFromPreset } from "@common/lib/preset";
import { loadDataIntoTable } from "@common/lib/load";
import { handleExport } from "@common/lib/export";
import { initFunctions } from "@common/lib/utils";

const storage = new Storage();
const PRESET_BASE_PATH = process.env.PRESET_BASE_PATH;

function parseBucketPath(gcsPath: string): { bucket: string; file: string } {
  const match = gcsPath.match(/^gs:\/\/([^/]+)\/(.+)$/);
  if (!match) throw new Error(`Invalid GCS path: ${gcsPath}`);
  return { bucket: match[1], file: match[2] };
}

async function readGCSFile(gcsPath: string): Promise<Buffer> {
  const { bucket, file } = parseBucketPath(gcsPath);
  const [contents] = await storage.bucket(bucket).file(file).download();
  return contents;
}

async function writeGCSFile(gcsPath: string, data: string): Promise<void> {
  const { bucket, file } = parseBucketPath(gcsPath);
  await storage.bucket(bucket).file(file).save(data);
}

http("formatter", async (req, res) => {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const { files, preset: presetName, outputPath } = req.body ?? {};

  if (
    !Array.isArray(files) ||
    !files.every((f) => typeof f === "string") ||
    typeof presetName !== "string" ||
    typeof outputPath !== "string"
  ) {
    res.status(400).json({ error: "Missing required fields: files (string[]), preset (string), outputPath (string)" });
    return;
  }

  if (!PRESET_BASE_PATH) {
    res.status(500).json({ error: "PRESET_BASE_PATH environment variable is not set" });
    return;
  }

  const normalizedBase = PRESET_BASE_PATH.endsWith("/") ? PRESET_BASE_PATH : `${PRESET_BASE_PATH}/`;
  const presetPath = `${normalizedBase}${presetName}.json`;

  let presetBuffer: Buffer;
  try {
    presetBuffer = await readGCSFile(presetPath);
  } catch (e) {
    res.status(400).json({ error: `Failed to read preset: ${e instanceof Error ? e.message : e}` });
    return;
  }

  const presetResult = loadPresetFromFile(new Uint8Array(presetBuffer));
  if (!presetResult.success) {
    res.status(400).json({ error: presetResult.error });
    return;
  }

  const preset = presetResult.preset;

  if (files.length !== preset.load.length) {
    res.status(400).json({
      error: `Expected ${preset.load.length} file(s) for preset, got ${files.length}`
    });
    return;
  }

  const db = new PGlite() as unknown as PGliteWithLive;
  await initFunctions(db);

  for (let i = 0; i < preset.load.length; i++) {
    let fileBuffer: Buffer;
    try {
      fileBuffer = await readGCSFile(files[i]);
    } catch (e) {
      res.status(400).json({ error: `Failed to read file ${files[i]}: ${e instanceof Error ? e.message : e}` });
      return;
    }

    const loadResult = await loadDataIntoTable(new Uint8Array(fileBuffer), db, preset.load[i]);
    if (!loadResult.success) {
      res.status(400).json({ error: loadResult.error });
      return;
    }
  }

  if (preset.queries.length > 0) {
    const queryResult = await runQueriesFromPreset(db, preset.queries);
    if (!queryResult.success) {
      res.status(400).json({ error: queryResult.error });
      return;
    }
  }

  const exportResult = await handleExport(db, preset.export, preset.format);
  if (!exportResult.success) {
    res.status(400).json({ error: exportResult.error });
    return;
  }

  const normalizedOutputPath = outputPath.endsWith("/") ? outputPath : `${outputPath}/`;
  const outputFiles: string[] = [];

  for (const file of exportResult.files ?? []) {
    const dest = `${normalizedOutputPath}${file.name}`;
    try {
      await writeGCSFile(dest, file.dataString);
      outputFiles.push(dest);
    } catch (e) {
      res.status(500).json({ error: `Failed to write ${dest}: ${e instanceof Error ? e.message : e}` });
      return;
    }
  }

  res.status(200).json({ outputFiles });
});
