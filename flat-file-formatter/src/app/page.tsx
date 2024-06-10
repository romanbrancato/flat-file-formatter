"use client";
import { useContext, useEffect, useState } from "react";
import { parse } from "papaparse";
import { Dropzone } from "@/components/dropzone";
import { Editor } from "@/components/editor";
import { DataContext } from "@/context/data-context";
import { PresetContext } from "@/context/preset-context";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
      <span className="text-md font-bold absolute left-1/2 -translate-x-1/2">
        Format a Flat File
      </span>
      <Select defaultValue="single">
        <SelectTrigger className="h-7 w-[145px] text-xs ml-auto">
          <span className="text-muted-foreground">Mode: </span>
          <SelectValue placeholder="Select mode" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem key="single" value="single" className="text-xs">
            Single
          </SelectItem>
          <SelectItem key="batch" value="batch" className="text-xs">
            Batch
          </SelectItem>
        </SelectContent>
      </Select>
      <Dropzone onChange={setFile} fileExtension=".csv, .txt" />
      <Editor />
    </main>
  );
}
