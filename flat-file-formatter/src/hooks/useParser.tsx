import { parseFile, ParserParams } from "@/lib/parser-functions";
import { useCallback, useEffect, useState } from "react";
import * as fns from "@/lib/data-functions";
import { Function, Preset } from "@/context/preset-context";

export function useParser() {
  const [isReady, setIsReady] = useState(false);
  const [params, setParams] = useState<ParserParams | null>(null);
  const [fileName, setFileName] = useState("");
  const [data, setData] = useState<Record<string, unknown>[]>([]);

  useEffect(() => {
    if (!params) return;
    parseFile(params)
      .then((data) => {
        setData(data);
        setFileName(params.file.name);
        setIsReady(true);
      })
      .catch((e) => {
        console.error(e);
      });
  }, [params]);

  const setName = useCallback(
    (schema: string) => {
      if (!params) return;
      setIsReady(false);
      setFileName(fns.setName(params?.file.name, schema));
      setIsReady(true);
    },
    [params],
  );

  const removeField = useCallback(
    (field: string) => {
      setIsReady(false);
      setData(fns.removeField(data, field));
      setIsReady(true);
    },
    [data],
  );

  const addField = useCallback(
    (field: Record<string, unknown>) => {
      setIsReady(false);
      setData(fns.addField(data, field));
      setIsReady(true);
    },
    [data],
  );

  const orderFields = useCallback(
    (order: string[]) => {
      setIsReady(false);
      setData(fns.orderFields(data, order));
      setIsReady(true);
    },
    [data],
  );

  const editHeader = useCallback(
    (field: Record<string, string>) => {
      setIsReady(false);
      setData(fns.editHeader(data, field));
      setIsReady(true);
    },
    [data],
  );

  const runFunction = useCallback(
    (func: Function) => {
      setIsReady(false);
      setData(fns.runFunction(data, func));
      setIsReady(true);
    },
    [data],
  );

  const applyPreset = useCallback(
    (preset: Preset) => {
      setIsReady(false);
      const newData = fns.applyPreset(data, preset);
      setData(newData);
      setIsReady(true);
    },
    [data],
  );

  return {
    isReady,
    fileName,
    setParams,
    data,
    setName,
    removeField,
    addField,
    orderFields,
    editHeader,
    runFunction,
    applyPreset,
  };
}
