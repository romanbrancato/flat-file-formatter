"use client";
import {useContext, useEffect, useState} from "react";
import Papa from "papaparse";
import {Options} from "@evologi/fixed-width";
import {Dropzone} from "@/components/dropzone";
import {FilePreview} from "@/components/file-preview";
import {SelectMode} from "@/components/select-mode";
import {ModeContext} from "@/context/mode-context";
import {ButtonParserConfig} from "@/components/button-parser-config";
import {SelectImportFormat} from "@/components/select-import-format";

export default function App() {
    const {mode} = useContext(ModeContext);
    const [files, setFiles] = useState<File[]>([]);
    const [config, setConfig] = useState<Omit<Papa.ParseLocalConfig<unknown, any>, "complete"> | Options | undefined>();
    const [importFormat, setImportFormat] = useState("delimited");


    useEffect(() => {

    }, [files]);

    return (
        <main className="flex flex-col gap-y-3">
            <span className="text-md font-bold absolute left-1/2 -translate-x-1/2">
                Format a Flat File
            </span>
            <SelectMode/>
            <div className="space-y-1">
                <div className="flex flex-row ml-auto gap-x-1">
                    <SelectImportFormat setImportFormat={setImportFormat}/>
                    <ButtonParserConfig setConfig={setConfig}/>
                </div>
                <Dropzone
                    onChange={setFiles}
                    fileExtension={importFormat === "delimited" ? ".csv" : ".txt"}
                    multiple={mode === "batch"}
                    showInfo={mode === "single"}
                />
            </div>
            <FilePreview files={files} setFiles={setFiles}/>
        </main>
    );
}
