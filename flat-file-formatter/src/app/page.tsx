"use client";
import { useContext, useEffect, useState } from "react";
import { Dropzone } from "@/components/dropzone";
import { SelectMode } from "@/components/select-mode";
import { ModeContext } from "@/context/mode-context";
import { ButtonParserConfig } from "@/components/button-parser-config";
import { ParserContext } from "@/context/parser-context";
import { PresetToolbar } from "@/components/preset-toolbar";
import { RecordTable } from "@/components/record-table";
import { FormOutput } from "@/components/forms/form-output";
import { ButtonExportFile } from "@/components/button-export-file";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { InfoCircledIcon } from "@radix-ui/react-icons";
import { BatchFileRow } from "@/components/batch-file-row";
import { ButtonAddField } from "@/components/button-add-field";
import { ButtonRemoveField } from "@/components/button-remove-field";
import { ButtonOperations } from "@/components/button-operations";
import { PresetContext } from "@/context/preset-context";
import { ButtonExportFileBatch } from "@/components/button-export-file-batch";

export default function App() {
  const { mode } = useContext(ModeContext);
  const { preset } = useContext(PresetContext);
  const { isReady, data, setParams } = useContext(ParserContext);
  const [files, setFiles] = useState<File[]>([]);

  const handleFileDelete = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  useEffect(() => {
    if (!preset.parser || !files.length) return;
    if (mode !== "batch") {
      setParams({
        file: files[files.length - 1],
        config: preset.parser,
      });
    }
  }, [files]);

  return (
    <main className="flex flex-col gap-y-3">
      <div className="relative flex">
        <div className="absolute left-[80%] top-1/2 z-10 flex -translate-x-1/2 -translate-y-1/2 transform flex-col items-center rounded-md border border-primary-foreground bg-primary-foreground md:flex-row">
          <ButtonParserConfig />
          <SelectMode />
        </div>
        <Dropzone
          className="z-0 flex-grow"
          onChange={setFiles}
          fileExtension={
            preset.parser?.format === "delimited" ? ".csv" : ".txt"
          }
          multiple={mode === "batch"}
        />
      </div>
      <div className="rounded-md border">
        <PresetToolbar />
        <div className="mx-5 my-3 flex flex-col gap-y-2 md:flex-row md:gap-x-3">
          {mode === "single" && isReady ? (
            <>
              <div className="flex flex-grow flex-col gap-y-1 overflow-hidden">
                {Object.entries(data.records)
                  .filter(([_, records]) => records.fields.length > 0)
                  .map(([tag, records]) => (
                    <RecordTable
                      key={tag + Date.now()}
                      tag={tag}
                      fields={records.fields}
                      rows={records.rows}
                    />
                  ))}
                <div className="flex flex-row gap-x-1 md:w-2/3">
                  <ButtonAddField />
                  <ButtonRemoveField />
                  <ButtonOperations />
                </div>
              </div>
              <div className="flex min-w-[200px] flex-col gap-y-3">
                <FormOutput />
                <div className="md:mt-auto">
                  <ButtonExportFile files={files} />
                </div>
              </div>
            </>
          ) : mode === "batch" && files.length ? (
            <div className="flex w-full flex-col gap-y-3">
              <div className="mx-auto flex w-full flex-col gap-y-2 rounded-md border p-2">
                {files.map((file, index) => (
                  <BatchFileRow
                    key={index}
                    file={file}
                    onFileDelete={() => handleFileDelete(index)}
                  />
                ))}
              </div>
              <div className="ml-auto w-1/5">
                <ButtonExportFileBatch files={files} />
              </div>
            </div>
          ) : (
            <div className="flex w-full items-center justify-center">
              <Alert className="m-3 min-w-fit md:w-1/2">
                <InfoCircledIcon />
                <AlertTitle>No File Uploaded</AlertTitle>
                <AlertDescription>
                  Upload a file above to get started.
                </AlertDescription>
              </Alert>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
