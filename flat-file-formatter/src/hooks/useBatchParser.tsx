import { useCallback, useEffect, useState } from "react";
import { Preset } from "@/types/preset";
import * as fns from "@/lib/data-functions";
import { parseFile } from "@/lib/parser-functions";
import { MultiFormatConfig } from "@/lib/parser-functions";

export type BatchParserParams = {
  files: File[];
  config: MultiFormatConfig;
};

export function useBatchParser() {
  const [isReady, setIsReady] = useState(false);
  const [params, setParams] = useState<BatchParserParams | null>(null);
  const [data, setData] = useState<Record<string, unknown>[][]>([]);

  useEffect(() => {
    if (!params) return;
    for (const file of params.files) {
      parseFile({ file: file, config: params.config })
        .then((data) => {
          setData((prevData) => [...prevData, data]);
          setIsReady(true);
        })
        .catch((e) => {
          console.error(e);
        });
    }
  }, [params]);

  const applyPreset = useCallback(
    (preset: Preset) => {
      setIsReady(false);
      const newData = data.map((file) => fns.applyPreset(file, preset));
      setData(newData);
      setIsReady(true);
    },
    [data, setIsReady],
  );

  return {
    isReady,
    setParams,
    data,
    applyPreset,
  };
}
