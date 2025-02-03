import { parseFile } from "@/common/lib/parser-fns";
import { useCallback, useEffect, useState } from "react";
import * as fns from "@/common/lib/data-fns";
import { Data, DataProcessorParams, Operation } from "@/common/types/schemas";

export function useDataProcessor() {
  const [isReady, setIsReady] = useState(false);
  const [params, setParams] = useState<DataProcessorParams | null>(null);
  const [data, setData] = useState<Data>({} as Data);
  const [focus, setFocus] = useState<string>("detail");

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

  useEffect(() => {
    if (!isReady) return;
    if (!Object.keys(data).includes(focus) && Object.keys(data).length > 0) {
      setFocus(Object.keys(data)[0]);
    }
  }, [isReady, data]);

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
    (changes: Operation[]) => {
      setIsReady(false);
      setData(fns.applyPreset(data, changes));
      setIsReady(true);
    },
    [data],
  );

  return {
    isReady,
    params,
    setParams,
    data,
    focus,
    setFocus,
    removeFields,
    addFields,
    orderFields,
    evaluateConditions,
    evaluateEquation,
    reformatData,
    applyPreset,
  };
}
