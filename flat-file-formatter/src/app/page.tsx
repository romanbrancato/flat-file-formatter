"use client";
import { useContext, useEffect, useState } from "react";
import { parse } from "papaparse";
import { Dropzone } from "@/components/dropzone";
import { Editor } from "@/components/editor";
import { DataContext } from "@/context/data-context";
import { PresetContext } from "@/context/preset-context";

export default function App() {
  const { setData } = useContext(DataContext);
  const { setOrder, setSymbol, resetPreset } = useContext(PresetContext);
  const [file, setFile] = useState<File | null>(null);

  // Parse the CSV file when a new file is set
  useEffect(() => {
    if (file) {
      parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: function (results) {
          resetPreset();
          setData(results.data as Record<string, unknown>[]);
          setOrder(results.meta.fields as string[]);
          setSymbol(results.meta.delimiter);
        },
      });
    }
  }, [file]);

  return (
    <main className="flex flex-col gap-y-3">
      <span className="text-center text-md font-bold">Format a Flat File.</span>
      <Dropzone onChange={setFile} fileExtension=".csv, .txt" />
      <Editor />
    </main>
  );
}
