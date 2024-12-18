import { parseFile } from "@/lib/parser-functions";
import { useCallback, useEffect, useState } from "react";
import * as fns from "@/lib/data-functions";
import { Data, Operation, ParserConfigSchema, Preset } from "@/types/schemas";
import { z } from "zod";

export const ParserParams = z.object({
  file: z.instanceof(File),
  config: ParserConfigSchema,
});
export type ParserParams = z.infer<typeof ParserParams>;

export function useParser() {
  const [isReady, setIsReady] = useState(false);
  const [params, setParams] = useState<ParserParams | null>(null);
  const [data, setData] = useState<Data>({} as Data);

  useEffect(() => {
    if (!params) return;
    setIsReady(false);
    parseFile(params)
      .then((data) => {
        setData(data);
        setIsReady(true);
      })
      .catch((e) => {
        console.error(e);
      });
  }, [params]);

  const removeFields = useCallback(
    (operation: Operation) => {
      setIsReady(false);
      setData(fns.removeFields(data, operation));
      setIsReady(true);
    },
    [data],
  );

  const addFields = useCallback(
    (operation: Operation) => {
      setIsReady(false);
      setData(fns.addFields(data, operation));
      setIsReady(true);
    },
    [data],
  );

  const orderFields = useCallback(
    (tag: string, order: number[]) => {
      setIsReady(false);
      setData(fns.orderFields(data, tag, order));
      setIsReady(true);
    },
    [data],
  );

  const evaluateConditions = useCallback(
    (operation: Operation) => {
      setIsReady(false);
      setData(fns.evaluateConditions(data, operation));
      setIsReady(true);
    },
    [data],
  );

  const evaluateEquation = useCallback(
    (operation: Operation) => {
      setIsReady(false);
      setData(fns.evaluateEquation(data, operation));
      setIsReady(true);
    },
    [data],
  );

  const reformatData = useCallback(
    (operation: Operation) => {
      setIsReady(false);
      setData(fns.reformatData(data, operation));
      setIsReady(true);
    },
    [data],
  );

  const applyPreset = useCallback(
    (preset: Preset) => {
      setIsReady(false);
      setData(fns.applyPreset(data, preset.changes));
      setIsReady(true);
    },
    [data],
  );

  return {
    isReady,
    params,
    setParams,
    data,
    removeFields,
    addFields,
    orderFields,
    evaluateConditions,
    evaluateEquation,
    reformatData,
    applyPreset,
  };
}
