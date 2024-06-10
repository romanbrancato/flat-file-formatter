import { PresetToolbar } from "@/components/preset-toolbar";
import { CSVTable } from "@/components/csv-table";
import { ExportOptions } from "@/components/export-options";
import { TableToolbar } from "@/components/table-toolbar";
import { ExportFileButton } from "@/components/export-file-button";

export function Editor() {
  return (
    <div className="rounded-md border">
      <PresetToolbar />
      <div className="flex flex-col md:flex-row mx-5 gap-y-2 md:gap-x-3 my-3">
        <div className="flex flex-col gap-y-1 overflow-hidden flex-grow">
          <CSVTable />
          <TableToolbar />
        </div>
        <div className="flex flex-col">
          <ExportOptions />
          <ExportFileButton />
        </div>
      </div>
    </div>
  );
}
