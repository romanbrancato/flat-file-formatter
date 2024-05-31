import { PresetToolbar } from "@/components/preset-toolbar";
import { CSVTable } from "@/components/csv-table";
import { ExportOptions } from "@/components/export-options";
import { TableToolbar } from "@/components/table-toolbar";
import { Button } from "@/components/ui/button";
import { Share2Icon } from "@radix-ui/react-icons";
import { useContext } from "react";
import { DataContext } from "@/context/data-context";

export function Editor() {
  const { data, exportFile } = useContext(DataContext);

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
          <Button
            disabled={data.length === 0}
            onClick={() => exportFile()}
            className="md:mt-auto"
          >
            <Share2Icon className="mr-2" />
            Export File
          </Button>
        </div>
      </div>
    </div>
  );
}
