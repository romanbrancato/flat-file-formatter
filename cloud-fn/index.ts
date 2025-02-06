import {Storage} from "@google-cloud/storage";
import {BigQuery} from "@google-cloud/bigquery";
import {generateFileBuffers, parseBuffer, parsePreset} from "./common/lib/parser-fns";
import {applyPreset} from "./common/lib/data-fns";
import {HttpFunction} from "@google-cloud/functions-framework";

interface RequestBody {
    query: string;
    preset: string;
    destination: string;
}

const queryOutputBucket = 'file-destinations';
const presetBucket = 'format-presets';

const storage = new Storage();
const bigquery = new BigQuery();

const exportQuery = async (query: string) => {
    const uuid = Math.random().toString(36).slice(2);
    const prefix = `exports/${uuid}_`;

    const [job] = await bigquery.createQueryJob({
        query: `EXPORT DATA OPTIONS(
      uri='gs://${queryOutputBucket}/${prefix}*.csv',
      format='CSV', header=true, overwrite=true
    ) AS ${query}`,
        location: 'US'
    });

    await job.getQueryResults();
    return prefix;
};

const combineFiles = async (prefix: string) => {
    const bucket = storage.bucket(queryOutputBucket);
    const [files] = await bucket.getFiles({ prefix });

    if (!files.length) throw new Error('No files exported from query.');

    // Sort files to ensure proper order (BigQuery exports are sometimes unordered)
    const sortedFiles = files.sort((a, b) => a.name.localeCompare(b.name));

    // Process first file (keep header) and subsequent files (strip header)
    const buffers = await Promise.all(sortedFiles.map(async (file, index) => {
        const [buffer] = await file.download();
        const content = buffer.toString();

        // For all files after the first, remove the header line
        return index === 0 ? content : content.split('\n').slice(1).join('\n');
    }));

    return new TextEncoder().encode(buffers.join('\n'));
};

const cleanupFiles = async (prefix: string) => {
    try {
        const bucket = storage.bucket(queryOutputBucket);
        const [files] = await bucket.getFiles({ prefix });
        await Promise.all(files.map(file => file.delete().catch(e => {
            console.error(`Failed to delete file ${file.name}:`, e);
        })));
    } catch (error) {
        console.error('Error during cleanup:', error);
    }
};

export const bqExport: HttpFunction = async (req, res) => {
    try {
        const {query, preset: presetName, destination} = req.body as RequestBody;
        if (!query || !presetName || !destination) throw new Error('Missing required parameters');

        // Load preset
        const [presetFile] = await storage.bucket(presetBucket).file(`${presetName}.json`).download();
        const preset = parsePreset(presetFile);

        // Process data pipeline
        const prefix = await exportQuery(query);
        let buffer;
        try {
            buffer = await combineFiles(prefix);
        } finally {
            await cleanupFiles(prefix);
        }

        const formattedData = applyPreset(await parseBuffer({buffer, config: preset.parser}), preset.changes);
        const buffers = generateFileBuffers(formattedData, preset);

        if (!buffers?.length) throw new Error('Failed to generate file, ensure preset.output is defined.');

        // Save files
        await Promise.all(
            buffers.map(({name, content}: {name: string, content: Uint8Array}) =>
                storage.bucket(destination)
                    .file(name)
                    .save(content, {
                        metadata: {
                            contentType: 'text/plain; charset=utf-8'
                        }
                    })
            )
        );

        return res.status(200).json({
            message: "Success",
            files: buffers.map(f => f.name)
        });

    } catch (error) {
        console.error('Processing failed:', error);
        return res.status(500).json({
            error: "Processing failed",
            details: error instanceof Error ? error.message : "Unknown error"
        });
    }
};