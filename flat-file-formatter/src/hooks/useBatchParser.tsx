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
  const [params, setParams] = useState<BatchParserParams | null>(null);
  const [data, setData] = useState<Data[]>([]);

  useEffect(() => {
    if (!params) return;
    setIsReady(false);
    for (const file of params.files) {
      parseFile({ file: file, config: params.config })
        .then((data) => {
          setData((prevData) => [
            ...prevData,
            fns.applyPreset(data, params.preset),
          ]);
          setIsReady(true);
        })
        .catch((e) => {
          console.error(e);
        });
    }
  }, [params]);

  return {
    isReady,
    setParams,
    data,
  };
}
