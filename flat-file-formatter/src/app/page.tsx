"use client";
import { useContext, useEffect, useState } from "react";
import { Dropzone } from "@/components/dropzone";
import { SelectMode } from "@/components/select-mode";
import { ModeContext } from "@/context/mode-context";
import { ButtonParserConfig } from "@/components/button-parser-config";
import { ParserContext } from "@/context/parser-context";
import { MultiFormatConfig } from "@/lib/parser-functions";
import { PresetToolbar } from "@/components/preset-toolbar";
import { FileTable } from "@/components/file-table";
import { TableToolbar } from "@/components/table-toolbar";
import { FormatMenu } from "@/components/format-menu";
import { ButtonExportFile } from "@/components/button-export-file";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { InfoCircledIcon } from "@radix-ui/react-icons";
import { BatchFileRow } from "@/components/batch-file-row";

export default function App() {
  const { mode } = useContext(ModeContext);
  const { setParams } = useContext(ParserContext);
  const [files, setFiles] = useState<File[]>([]);
  const [config, setConfig] = useState<MultiFormatConfig>({
    format: "delimited",
  });

  const handleFileDelete = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  useEffect(() => {
    if (!config || !files.length) return;
    if (mode !== "batch") {
      setParams({
        file: files[files.length - 1],
        config: config,
      });
    }
  }, [files]);

  return (
    <main className="flex flex-col gap-y-3">
      <span className="text-md font-bold absolute left-1/2 -translate-x-1/2">
        Format a Flat File
      </span>
      <SelectMode />
      <div className="space-y-1">
        <ButtonParserConfig setConfig={setConfig} />
        <Dropzone
          onChange={setFiles}
          fileExtension={config?.format === "delimited" ? ".csv" : ".txt"}
          multiple={mode === "batch"}
        />
      </div>
      <div className="rounded-md border">
        <PresetToolbar />
        <div className="flex flex-col md:flex-row mx-5 gap-y-2 md:gap-x-3 my-3">
          {mode === "single" ? (
            <>
              <div className="flex flex-col gap-y-1 overflow-hidden flex-grow">
                <FileTable />
                <TableToolbar />
              </div>
              <div className="flex flex-col">
                <FormatMenu />
                <ButtonExportFile files={files} />
              </div>
            </>
          ) : (
            <div className="flex flex-col w-full gap-y-1">
              <div className="flex flex-col gap-y-2 mx-auto w-full border rounded-md p-2">
                {!files.length && (
                  <Alert className="w-1/2 mx-auto">
                    <InfoCircledIcon />
                    <AlertTitle>No Files Uploaded</AlertTitle>
                    <AlertDescription>
                      Upload files above to get started.
                    </AlertDescription>
                  </Alert>
                )}
                {files.map((file, index) => (
                  <BatchFileRow
                    key={index}
                    file={file}
                    onFileDelete={() => handleFileDelete(index)}
                  />
                ))}
              </div>
              <div className="ml-auto w-1/5">
                <ButtonExportFile
                  files={files}
                  setFiles={setFiles}
                  config={config}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
