import { useEffect, useState } from "react";
import * as fns from "@/lib/data-functions";
import { exportFile, parseFile } from "@/lib/parser-functions";
import { z } from "zod";
import { Data, PresetSchema } from "@/types/schemas";
import path from "node:path";

export const BatchParserParams = z.object({
  files: z.array(z.instanceof(File)),
  preset: PresetSchema,
});

export type BatchParserParams = z.infer<typeof BatchParserParams>;

export function useBatchParser() {
  const [isBatchReady, setIsBatchReady] = useState(false);
  const [batchParams, setBatchParams] = useState<BatchParserParams | null>(
    null,
  );
  const [data, setData] = useState<Data[]>([]);

  useEffect(() => {
    if (!batchParams) return;
    setIsBatchReady(false);
    for (const file of batchParams.files) {
      parseFile({ file: file, config: batchParams.preset.parser })
        .then((data) => {
          setData((prevData) => [
            ...prevData,
            fns.applyPreset(data, batchParams.preset.changes),
          ]);
          setIsBatchReady(true);
        })
        .catch((e) => {
          console.error(e);
        });
    }
  }, [batchParams]);

  useEffect(() => {
    if (!isBatchReady || !batchParams) return;
    data.forEach((data, index) => {
      exportFile(
        data,
        batchParams.preset,
        path.parse(batchParams.files[index].name).name,
      );
    });
    setData([]);
    setBatchParams(null);
    setIsBatchReady(false);
  }, [isBatchReady]);

  return {
    isBatchReady,
    setBatchParams,
    data,
  };
}
