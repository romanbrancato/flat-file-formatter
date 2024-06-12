import { PresetToolbar } from "@/components/preset-toolbar";
import { CSVTable } from "@/components/csv-table";
import { ExportOptions } from "@/components/export-options";
import { TableToolbar } from "@/components/table-toolbar";
import { ExportFileButton } from "@/components/export-file-button";
import { useContext } from "react";
import { ModeContext } from "@/context/mode-context";
import { Cross2Icon, FileTextIcon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

interface PreviewProps {
  files: File[];
}

export function Preview({ files }: PreviewProps) {
  const { mode } = useContext(ModeContext);
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
              <ExportOptions />
              <ExportFileButton />
            </div>
          </>
        ) : (
          <div className="flex flex-col gap-y-2 mx-auto w-full">
            {files.map((file, index) => (
              <div
                key={index}
                className="flex flex-row justify-between items-center rounded-md px-5 py-3 bg-muted text-xs font-bold"
              >
                <div className="flex flex-row items-center gap-x-2">
                  <FileTextIcon /> {file.name}
                </div>
                <span>{(file.size / 1024).toFixed(2)} KB</span>
                <Cross2Icon />
              </div>
            ))}
            <Separator />
            <div className="flex flex-row justify-end ml-auto gap-x-1">
              <Button className="flex-1 px-10">Export Files</Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
