import { Data, parseFile, ParserParams } from "@/lib/parser-functions";
import { useCallback, useEffect, useState } from "react";
import * as fns from "@/lib/data-functions";
import { Function, Preset } from "@/context/preset-context";
import path from "node:path";

export function useParser() {
  const [isReady, setIsReady] = useState(false);
  const [params, setParams] = useState<ParserParams | null>(null);
  const [data, setData] = useState<Data>({
    name: "",
    rows: [],
  });

  useEffect(() => {
    if (!params) return;
    parseFile(params)
      .then((data) => {
        setData(data);
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
      setData({
        ...data,
        name: fns.setName(path.parse(params.file.name).name, schema),
      });
      setIsReady(true);
    },
    [params, data],
  );

  const removeField = useCallback(
    (field: string) => {
      setIsReady(false);
      setData({ ...data, rows: fns.removeField(data.rows, field) });
      setIsReady(true);
    },
    [data],
  );

  const addField = useCallback(
    (field: Record<string, unknown>) => {
      setIsReady(false);
      setData({ ...data, rows: fns.addField(data.rows, field) });
      setIsReady(true);
    },
    [data],
  );

  const orderFields = useCallback(
    (order: string[]) => {
      setIsReady(false);
      setData({ ...data, rows: fns.orderFields(data.rows, order) });
      setIsReady(true);
    },
    [data],
  );

  const editHeader = useCallback(
    (field: Record<string, string>) => {
      setIsReady(false);
      setData({ ...data, rows: fns.editHeader(data.rows, field) });
      setIsReady(true);
    },
    [data],
  );

  const runFunction = useCallback(
    (func: Function) => {
      setIsReady(false);
      setData({ ...data, rows: fns.runFunction(data.rows, func) });
      setIsReady(true);
    },
    [data],
  );

  const applyPreset = useCallback(
    (preset: Preset) => {
      setIsReady(false);
      setData(fns.applyPreset(data, preset));
      setIsReady(true);
    },
    [data],
  );

  return {
    isReady,
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
