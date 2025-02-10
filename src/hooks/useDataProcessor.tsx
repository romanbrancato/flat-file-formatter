import { useCallback, useEffect, useState } from "react";
import { Data, DataProcessorParams, Operation } from "@common/types/schemas";
import {parseBuffer} from "@common/lib/parser-fns";
import {handleAdd, handleConditional, handleEquation, handlePreset, handleReformat, handleRemove} from "@common/lib/data-fns";

export function useDataProcessor() {
  const [isReady, setIsReady] = useState(false);
  const [params, setParams] = useState<DataProcessorParams | null>(null);
  const [data, setData] = useState<Data>({} as Data);
  const [focus, setFocus] = useState<string>("detail");

  useEffect(() => {
    if (!params) return;
    setIsReady(false);
    parseBuffer(params)
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
      setData(handleRemove(data, operation));
      setIsReady(true);
    },
    [data],
  );

  const addFields = useCallback(
    (operation: Operation) => {
      setIsReady(false);
      setData(handleAdd(data, operation));
      setIsReady(true);
    },
    [data],
  );

  const evaluateConditions = useCallback(
    (operation: Operation) => {
      setIsReady(false);
      setData(handleConditional(data, operation));
      setIsReady(true);
    },
    [data],
  );

  const evaluateEquation = useCallback(
    (operation: Operation) => {
      setIsReady(false);
      setData(handleEquation(data, operation));
      setIsReady(true);
    },
    [data],
  );

  const reformatData = useCallback(
    (operation: Operation) => {
      setIsReady(false);
      setData(handleReformat(data, operation));
      setIsReady(true);
    },
    [data],
  );

  const applyPreset = useCallback(
    (changes: Operation[]) => {
      setIsReady(false);
      setData(handlePreset(data, changes));
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
    evaluateConditions,
    evaluateEquation,
    reformatData,
    applyPreset,
  };
}
