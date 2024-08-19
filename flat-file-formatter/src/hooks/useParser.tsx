import { parseFile, ParserParams } from "@/lib/parser-functions";
import { useCallback, useEffect, useState } from "react";
import * as fns from "@/lib/data-functions";
import path from "node:path";
import { Data, Field, Operation, Preset } from "@/types/schemas";

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

  const applyPattern = useCallback(
    (schema: string) => {
      if (!params) return;
      setIsReady(false);
      setData({
        ...data,
        name: fns.applyPattern(path.parse(params.file.name).name, schema),
      });
      setIsReady(true);
    },
    [params, data],
  );

  const removeField = useCallback(
    ({ flag, name }: Field) => {
      setIsReady(false);
      setData({
        ...data,
        [flag]: fns.removeField(data.records[flag], name),
      });
      setIsReady(true);
    },
    [data],
  );

  const addField = useCallback(
    (
      flag: "header" | "detail" | "trailer",
      value: string,
      name: string,
      after?: Field | null,
    ) => {
      setIsReady(false);
      setData({
        ...data,
        [flag]: fns.addField(data.records[flag], name, value, after?.name),
      });
      setIsReady(true);
    },
    [data],
  );

  const orderFields = useCallback(
    (flag: "header" | "detail" | "trailer", order: string[]) => {
      setIsReady(false);
      setData({ ...data, [flag]: fns.orderFields(data.records[flag], order) });
      setIsReady(true);
    },
    [data],
  );

  const performOperation = useCallback(
    (operation: Operation) => {
      setIsReady(false);
      setData({
        ...data,
        [operation.output.flag]: fns.performOperation(data, operation),
      });
      setIsReady(true);
    },
    [data],
  );

  const applyPreset = useCallback(
    (preset: Preset) => {
      setIsReady(false);
      setData({ ...fns.applyPreset(data, preset.changes) });
      setIsReady(true);
    },
    [data],
  );

  return {
    isReady,
    params,
    setParams,
    data,
    applyPattern,
    removeField,
    addField,
    orderFields,
    performOperation,
    applyPreset,
  };
}
