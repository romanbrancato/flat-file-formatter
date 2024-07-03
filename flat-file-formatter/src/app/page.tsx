"use client";
import {useContext, useEffect, useState} from "react";
import Papa from "papaparse";
import {Options} from "@evologi/fixed-width";
import {Dropzone} from "@/components/dropzone";
import {FilePreview} from "@/components/file-preview";
import {SelectMode} from "@/components/select-mode";
import {ModeContext} from "@/context/mode-context";
import {ButtonParserConfig, configSchema} from "@/components/button-parser-config";
import {SelectImportFormat} from "@/components/select-import-format";
import {ParserContext} from "@/context/parser-context";
import {MultiFormatConfig} from "@/lib/parser-functions";
import {Separator} from "@/components/ui/separator";


export default function App() {
    const {mode} = useContext(ModeContext);
    const {setParams, data} = useContext(ParserContext);
    const [files, setFiles] = useState<File[]>([]);
    const [config, setConfig] = useState<MultiFormatConfig>({
        format: "delimited",
        header: false,
        skipEmptyLines: true
    });

    useEffect(() => {
        if(!config || files.length === 0) return;
        if (mode !== "batch") {
            setParams({
                file: files[0],
                config: config
            })
        }
    }, [files]);

    return (
        <main className="flex flex-col gap-y-3">
            <span className="text-md font-bold absolute left-1/2 -translate-x-1/2">
                Format a Flat File
            </span>
            <SelectMode/>
            <div className="space-y-1">
                <ButtonParserConfig setConfig={setConfig}/>
                <Dropzone
                    onChange={setFiles}
                    fileExtension={config?.format === "delimited" ? ".csv" : ".txt"}
                    multiple={mode === "batch"}
                    showInfo={mode === "single"}
                />
            </div>
            <FilePreview files={files} setFiles={setFiles}/>
            <div>{JSON.stringify(data, null, 2)}</div>
        </main>
    );
}
