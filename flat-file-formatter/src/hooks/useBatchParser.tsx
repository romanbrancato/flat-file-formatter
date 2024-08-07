import { useCallback, useEffect, useState } from "react";
import * as fns from "@/lib/data-functions";
import { Data, parseFile } from "@/lib/parser-functions";
import { PresetSchema } from "@/context/preset-context";
import { ConfigSchema } from "@/components/button-parser-config";
import { z } from "zod";

export const BatchParserParams = z.object({
  files: z.array(z.instanceof(File)),
  config: ConfigSchema,
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
      parseFile({ file: file, config: batchParams.config })
        .then((data) => {
          setData((prevData) => [
            ...prevData,
            fns.applyPreset(data, batchParams.preset),
          ]);
          setIsBatchReady(true);
        })
        .catch((e) => {
          console.error(e);
        });
    }
  }, [batchParams]);

  const resetBatchParser = useCallback(() => {
    setIsBatchReady(false);
    setData([]);
    setBatchParams(null);
  }, []);

  return {
    isBatchReady,
    setBatchParams,
    data,
    resetBatchParser,
  };
}
