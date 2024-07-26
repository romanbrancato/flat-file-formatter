import { Data, parseFile, ParserParams } from "@/lib/parser-functions";
import { useCallback, useEffect, useState } from "react";
import * as fns from "@/lib/data-functions";
import path from "node:path";
import { Field, Function, Preset } from "@/context/preset-context";
import { AddField } from "@/components/button-add-field";

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
    ({ flag, name }: Field) => {
      setIsReady(false);
      setData({
        ...data,
        [flag]: fns.removeField(data[flag], name),
      });
      setIsReady(true);
    },
    [data],
  );

  const addField = useCallback(
    ({ flag, name, value }: AddField) => {
      setIsReady(false);
      setData({
        ...data,
        [flag]: fns.addField(data[flag], { [name]: value }),
      });
      setIsReady(true);
    },
    [data],
  );

  const orderFields = useCallback(
    (flag: "header" | "detail" | "trailer", order: string[]) => {
      setIsReady(false);
      setData({ ...data, [flag]: fns.orderFields(data[flag], order) });
      setIsReady(true);
    },
    [data],
  );

  const runFunction = useCallback(
    (fn: Function) => {
      setIsReady(false);
      setData({ ...data, [fn.output.flag]: fns.runFunction(data, fn) });
      setIsReady(true);
    },
    [data],
  );

  const applyPreset = useCallback(
    (preset: Preset) => {
      setIsReady(false);
      setData({ ...fns.applyPreset(data, preset) });
      setIsReady(true);
    },
    [data],
  );

  return {
    isReady,
    params,
    setParams,
    data,
    setName,
    removeField,
    addField,
    orderFields,
    runFunction,
    applyPreset,
  };
}
