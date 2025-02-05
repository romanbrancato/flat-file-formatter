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

const storage = new Storage();
const bigquery = new BigQuery();

const exportQuery = async (query: string) => {
    const uuid = Math.random().toString(36).slice(2);
    const prefix = `exports/${uuid}_`;

    const [job] = await bigquery.createQueryJob({
        query: `EXPORT DATA OPTIONS(
      uri='gs://file-destinations/${prefix}*.csv',
      format='CSV', header=true, overwrite=true
    ) AS ${query}`,
        location: 'US'
    });

    await job.getQueryResults();
    return prefix;
};

const combineFiles = async (prefix: string) => {
    const [files] = await storage.bucket('file-destinations').getFiles({prefix});
    if (!files.length) throw new Error('No files exported');

    const buffers = await Promise.all(files.map(file => file.download()));
    return new TextEncoder().encode(buffers.map(b => b[0].toString()).join(''));
};

export const bqExport: HttpFunction = async (req, res) => {
    try {
        const {query, preset: presetName, destination} = req.body as RequestBody;
        if (!query || !presetName || !destination) return res.status(400).json({error: "Missing required fields"});

        // Load preset
        const [presetFile] = await storage.bucket("format-presets").file(`${presetName}.json`).download();
        const preset = parsePreset(presetFile);

        // Process data pipeline
        const buffer = await exportQuery(query).then(combineFiles);
        const processedData = applyPreset(await parseBuffer({buffer, config: preset.parser}), preset.changes);
        const buffers = generateFileBuffers(processedData, preset);

        if (!buffers?.length) return res.status(500).json({error: "File generation failed"});

        // Save files
        await Promise.all(
            buffers.map(({name, content}) =>
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
            files: buffers.map(f => f.name),
            count: buffers.length
        });

    } catch (error) {
        console.error('Processing failed:', error);
        return res.status(500).json({
            error: "Processing failed",
            details: error instanceof Error ? error.message : "Unknown error"
        });
    }
};