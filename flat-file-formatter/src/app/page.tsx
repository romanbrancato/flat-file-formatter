"use client";
import { useContext, useEffect, useState } from "react";
import Papa from "papaparse";
import { parse } from "@evologi/fixed-width";
import { Dropzone } from "@/components/dropzone";
import { FilePreview } from "@/components/file-preview";
import { DataContext } from "@/context/data-context";
import { PresetContext } from "@/context/preset-context";
import { SelectMode } from "@/components/select-mode";
import { ModeContext } from "@/context/mode-context";
import path from "node:path";
import { ButtonParserConfig } from "@/components/button-parser-config";
import { SelectImportFormat } from "@/components/select-import-format";
import { toast } from "sonner";

export default function App() {
  const { mode } = useContext(ModeContext);
  const { setData, setName } = useContext(DataContext);
  const { setSymbol, resetPreset } = useContext(PresetContext);
  const [files, setFiles] = useState<File[]>([]);
  const [config, setConfig] = useState<{ property: string; width: number }[]>(
    [],
  );
  const [importFormat, setImportFormat] = useState("delimited");

  useEffect(() => {
    if (!files.length || mode === "batch") return;
    if (importFormat === "fixed" && !config.length) {
      toast.error("Cannot Parse File", {
        description: "No widths defined in configuration.",
      });
      return;
    }
    if (importFormat === "delimited") {
      Papa.parse(files[files.length - 1], {
        header: true,
        skipEmptyLines: true,
        complete: function (results) {
          resetPreset();
          setData(results.data as Record<string, unknown>[]);
          setName(`${path.parse(files[files.length - 1].name).name}`);
          setSymbol(results.meta.delimiter);
        },
      });
    } else {
      const reader = new FileReader();
      reader.onload = (event) => {
        const fileContents = event.target?.result as string;
        const data: Record<string, unknown>[] = parse(fileContents, {
          fields: config,
        });
        resetPreset();
        setData(data);
        setName(`${path.parse(files[files.length - 1].name).name}`);
        setSymbol(" ");
      };
      reader.readAsText(files[files.length - 1]);
    }
  }, [files]);

  return (
    <main className="flex flex-col gap-y-3">
      <span className="text-md font-bold absolute left-1/2 -translate-x-1/2">
        Format a Flat File
      </span>
      <SelectMode />
      <div className="space-y-1">
        <div className="flex flex-row ml-auto gap-x-1">
          <SelectImportFormat setImportFormat={setImportFormat} />
          <ButtonParserConfig setConfig={setConfig} />
        </div>
        <Dropzone
          onChange={setFiles}
          fileExtension={importFormat === "delimited" ? ".csv" : ".txt"}
          multiple={mode === "batch"}
          showInfo={mode === "single"}
        />
      </div>
      <FilePreview files={files} setFiles={setFiles} />
    </main>
  );
}
