import Papa from "papaparse";
import {Options} from "@evologi/fixed-width";
import {useCallback, useEffect, useState} from "react";
import {Preset} from "@/types/preset";
import * as fns from "@/lib/data-functions";
import {parseFile} from "@/lib/parser-functions";

export type BatchParserParams = {
    files: File[];
    format: "delimited";
    config: Omit<Papa.ParseLocalConfig<unknown, any>, "complete">
} | {
    files: File[];
    format: "fixed";
    config: Options
}

export function useBatchParser() {
    const [isReady, setIsReady] = useState(false);
    const [params, setParams] = useState<BatchParserParams | null>(null);
    const [data, setData] = useState<Record<string, unknown>[][]>([]);

    useEffect(() => {
        if (!params) return;
        for (const file of params.files) {
            parseFile({file, ...params}).then((data) => {
                setData((prevData) => [...prevData, data]);
                setIsReady(true);
            }).catch((e) => {
                console.error(e);
            });
        }
    }, [params]);

    const applyPreset = useCallback((preset: Preset) => {
        setIsReady(false);
        data.map((file, index) => {
            data[index] = fns.applyPreset(file, preset);
        })
        setIsReady(true);
    }, [data, setIsReady]);

    return {
        isReady,
        setParams,
        data,
        applyPreset
    }
}