"use client";
import { useContext, useEffect, useState } from "react";
import { parse } from "papaparse";
import { Dropzone } from "@/components/dropzone";
import { FilePreview } from "@/components/file-preview";
import { DataContext } from "@/context/data-context";
import { PresetContext } from "@/context/preset-context";
import { ModeSelect } from "@/components/mode-select";
import { ModeContext } from "@/context/mode-context";
import path from "node:path";

export default function App() {
  const { mode } = useContext(ModeContext);
  const { setData, setName } = useContext(DataContext);
  const { setOrder, setSymbol, resetPreset } = useContext(PresetContext);
  const [files, setFiles] = useState<File[]>([]);

  useEffect(() => {
    if (!files.length || mode === "batch") return;
    parse(files[files.length - 1], {
      header: true,
      skipEmptyLines: true,
      complete: function (results) {
        resetPreset();
        setData(results.data as Record<string, unknown>[]);
        setName(`${path.parse(files[files.length - 1].name).name}_export`);
        setOrder(results.meta.fields as string[]);
        setSymbol(results.meta.delimiter);
      },
    });
  }, [files]);

  useEffect(() => {
    setFiles([]);
    setData([]);
    resetPreset();
  }, [mode]);

  return (
    <main className="flex flex-col gap-y-3">
      <span className="text-md font-bold absolute left-1/2 -translate-x-1/2">
        Format a Flat File
      </span>
      <ModeSelect />
      <Dropzone
        onChange={setFiles}
        fileExtension=".csv"
        multiple={mode === "batch"}
        showInfo={mode === "single"}
      />
      <FilePreview files={files} />
    </main>
  );
}
