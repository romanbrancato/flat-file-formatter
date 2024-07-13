import { Data, parseFile, ParserParams } from "@/lib/parser-functions";
import { useCallback, useEffect, useState } from "react";
import * as fns from "@/lib/data-functions";
import {
  Field,
  FieldValue,
  Function,
  Order,
  Preset,
} from "@/context/preset-context";
import path from "node:path";

export function useParser() {
  const [isReady, setIsReady] = useState(false);
  const [params, setParams] = useState<ParserParams | null>(null);
  const [data, setData] = useState<Data>({} as Data);

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

  useEffect(() => {
    console.log(data.header);
  }, [data]);

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
    ({ flag, name, value }: FieldValue) => {
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
    ({ flag, order }: Order) => {
      setIsReady(false);
      setData({ ...data, [flag]: fns.orderFields(data[flag], order) });
      setIsReady(true);
    },
    [data],
  );

  const editHeader = useCallback(
    ({ flag, name, value }: FieldValue) => {
      setIsReady(false);
      setData({ ...data, [flag]: fns.editHeader(data[flag], { name, value }) });
      setIsReady(true);
    },
    [data],
  );

  const runFunction = useCallback(
    (fn: Function) => {
      setIsReady(false);
      setData({
        ...data,
        [fn.resultField.flag]: fns.runFunction(data[fn.field.flag], fn),
      });
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
    params,
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
