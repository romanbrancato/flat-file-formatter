import { useEffect, useState } from "react";
import * as fns from "@/lib/data-functions";
import { Data, MultiFormatConfig, parseFile } from "@/lib/parser-functions";
import { Preset } from "@/context/preset-context";

export type BatchParserParams = {
  files: File[];
  config: MultiFormatConfig;
  preset: Preset;
};

export function useBatchParser() {
  const [isReady, setIsReady] = useState(false);
  const [batchParams, setBatchParams] = useState<BatchParserParams | null>(
    null,
  );
  const [data, setData] = useState<Data[]>([]);

  useEffect(() => {
    if (!batchParams) return;
    setIsReady(false);
    for (const file of batchParams.files) {
      parseFile({ file: file, config: batchParams.config })
        .then((data) => {
          setData((prevData) => [
            ...prevData,
            fns.applyPreset(data, batchParams.preset),
          ]);
          setIsReady(true);
        })
        .catch((e) => {
          console.error(e);
        });
    }
  }, [batchParams]);

  return {
    isReady,
    setBatchParams,
    data,
  };
}
