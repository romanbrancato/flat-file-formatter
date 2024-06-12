"use client";
import { useContext, useEffect, useState } from "react";
import { parse } from "papaparse";
import { Dropzone } from "@/components/dropzone";
import { Preview } from "@/components/preview";
import { DataContext } from "@/context/data-context";
import { PresetContext } from "@/context/preset-context";
import { ModeSelect } from "@/components/mode-select";
import { ModeContext } from "@/context/mode-context";

export default function App() {
  const { mode } = useContext(ModeContext);
  const { setData } = useContext(DataContext);
  const { setOrder, setSymbol, resetPreset } = useContext(PresetContext);
  const [files, setFiles] = useState<File[]>([]);

  // Parse the CSV file when a new file is set
  useEffect(() => {
    if (!files.length) return;
    parse(files[files.length - 1], {
      header: true,
      skipEmptyLines: true,
      complete: function (results) {
        resetPreset();
        setData(results.data as Record<string, unknown>[]);
        setOrder(results.meta.fields as string[]);
        setSymbol(results.meta.delimiter);
      },
    });
    console.log(files);
  }, [files]);

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
      <Preview files={files} />
    </main>
  );
}
