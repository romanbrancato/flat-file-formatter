import { PresetToolbar } from "@/components/preset-toolbar";
import { CSVTable } from "@/components/csv-table";
import { FormatMenu } from "@/components/format-menu";
import { TableToolbar } from "@/components/table-toolbar";
import { ButtonExportFile } from "@/components/button-export-file";
import { useContext } from "react";
import { ModeContext } from "@/context/mode-context";
import { InfoCircledIcon } from "@radix-ui/react-icons";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { BatchFileRow } from "@/components/batch-file-row";

export function FileDisplay({
  files,
  setFiles,
}: {
  files: File[];
  setFiles: (files: File[]) => void;
}) {
  const { mode } = useContext(ModeContext);

  const handleFileDelete = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  return (
    <div className="rounded-md border">
      <PresetToolbar />
      <div className="flex flex-col md:flex-row mx-5 gap-y-2 md:gap-x-3 my-3">
        {mode === "single" ? (
          <>
            <div className="flex flex-col gap-y-1 overflow-hidden flex-grow">
              <CSVTable />
              <TableToolbar />
            </div>
            <div className="flex flex-col">
              <FormatMenu />
              <ButtonExportFile />
            </div>
          </>
        ) : (
          <div className="flex flex-col w-full gap-y-1">
            <div className="flex flex-col gap-y-2 mx-auto w-full border rounded-md p-2">
              {files.length === 0 && (
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
              <ButtonExportFile files={files} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
