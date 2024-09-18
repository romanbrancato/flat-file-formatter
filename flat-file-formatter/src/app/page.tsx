"use client";
import { useContext, useEffect, useState } from "react";
import { Dropzone } from "@/components/dropzone";
import { SelectMode } from "@/components/select-mode";
import { ModeContext } from "@/context/mode-context";
import { ButtonParserConfig } from "@/components/button-parser-config";
import { ParserContext } from "@/context/parser-context";
import { PresetToolbar } from "@/components/preset-toolbar";
import { RecordTable } from "@/components/record-table";
import { FormExportConfig } from "@/components/forms/form-export-config";
import { ButtonExportFile } from "@/components/button-export-file";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { InfoCircledIcon } from "@radix-ui/react-icons";
import { BatchFileRow } from "@/components/batch-file-row";
import { ButtonAddField } from "@/components/button-add-field";
import { ButtonRemoveField } from "@/components/button-remove-field";
import { ButtonOperations } from "@/components/button-operations";
import { PresetContext } from "@/context/preset-context";

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
      <span className="text-md font-bold absolute left-1/2 -translate-x-1/2">
        Format a Flat File
      </span>
      <SelectMode />
      <div className="space-y-1">
        <ButtonParserConfig />
        <Dropzone
          onChange={setFiles}
          fileExtension={
            preset.parser?.format === "delimited" ? ".csv" : ".txt"
          }
          multiple={mode === "batch"}
        />
      </div>
      <div className="rounded-md border">
        <PresetToolbar />
        <div className="flex flex-col md:flex-row mx-5 gap-y-2 md:gap-x-3 my-3">
          {mode === "single" && isReady ? (
            <>
              <div className="flex flex-col gap-y-1 overflow-hidden flex-grow">
                {Object.entries(data.records)
                  .filter(
                    ([tag, records]) => Object.keys(records[0]).length > 0,
                  )
                  .map(([tag, records]) => (
                    <RecordTable key={tag} tag={tag} />
                  ))}
                <div className="flex flex-row gap-x-1 md:w-2/3">
                  <ButtonAddField />
                  <ButtonRemoveField />
                  <ButtonOperations />
                </div>
              </div>
              <div className="flex flex-col min-w-[200px] gap-y-3">
                <FormExportConfig />
                <div className="md:mt-auto">
                  <ButtonExportFile files={files} />
                </div>
              </div>
            </>
          ) : mode === "batch" && files.length ? (
            <div className="flex flex-col w-full gap-y-3">
              <div className="flex flex-col gap-y-2 mx-auto w-full border rounded-md p-2">
                {files.map((file, index) => (
                  <BatchFileRow
                    key={index}
                    file={file}
                    onFileDelete={() => handleFileDelete(index)}
                  />
                ))}
              </div>
              <div className="ml-auto w-1/5">
                <ButtonExportFile files={files} setFiles={setFiles} />
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center w-full">
              <Alert className="md:w-1/2 m-3 min-w-fit">
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
