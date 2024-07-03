import { parseFile, ParserParams } from "@/lib/parser-functions";
import { useCallback, useEffect, useState } from "react";
import { Function } from "@/types/preset";
import * as fns from "@/lib/data-functions";

export function useParser() {
  const [isReady, setIsReady] = useState(false);
  const [params, setParams] = useState<ParserParams | null>(null);
  const [data, setData] = useState<Record<string, unknown>[]>([]);

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

  const removeField = useCallback(
    (field: string) => {
      setIsReady(false);
      setData(fns.removeField(data, field));
      setIsReady(true);
    },
    [data, isReady],
  );

  const addField = useCallback(
    (field: Record<string, unknown>) => {
      setIsReady(false);
      setData(fns.addField(data, field));
      setIsReady(true);
    },
    [data, isReady],
  );

  const orderFields = useCallback(
    (order: string[]) => {
      setIsReady(false);
      setData(fns.orderFields(data, order));
      setIsReady(true);
    },
    [data, isReady],
  );

  const editHeader = useCallback(
    (field: Record<string, string>) => {
      setIsReady(false);
      setData(fns.editHeader(data, field));
      setIsReady(true);
    },
    [data, isReady],
  );

  const runFunction = useCallback(
    (func: Function) => {
      setIsReady(false);
      setData(fns.runFunction(data, func));
      setIsReady(true);
    },
    [data, setIsReady],
  );

  return {
    isReady,
    setParams,
    data,
    removeField,
    addField,
    orderFields,
    editHeader,
    runFunction,
  };
}
