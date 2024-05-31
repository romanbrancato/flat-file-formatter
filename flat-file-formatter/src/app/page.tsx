"use client";
import { useContext, useEffect, useState } from "react";
import { parse } from "papaparse";
import { Dropzone } from "@/components/dropzone";
import { Editor } from "@/components/editor";
import { DataContext } from "@/context/data-context";

export default function App() {
  const { setSymbol, setData } = useContext(DataContext);
  const [file, setFile] = useState<File | null>(null);

  // Parse the CSV file when a new file is set
  useEffect(() => {
    if (file) {
      parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: function (results) {
          console.log("Parsing complete:", results);
          setData(results.data as Record<string, unknown>[]);
          setSymbol(results.meta.delimiter);
        },
      });
    }
  }, [file]);

  return (
    <main className="flex flex-col justify-between] gap-y-3 mb-3">
      <span className="text-center text-md font-bold">Format a Flat File.</span>
      <Dropzone onChange={setFile} className="w-full" fileExtension="csv" />
      <Editor />
    </main>
  );
}
