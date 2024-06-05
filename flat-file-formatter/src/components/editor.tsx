import { PresetToolbar } from "@/components/preset-toolbar";
import { CSVTable } from "@/components/csv-table";
import { ExportOptions } from "@/components/export-options";
import { TableToolbar } from "@/components/table-toolbar";
import { Button } from "@/components/ui/button";
import { Share2Icon } from "@radix-ui/react-icons";
import { useContext } from "react";
import { DataContext } from "@/context/data-context";
import { PresetContext } from "@/context/preset-context";
import { unparse } from "papaparse";

export function Editor() {
  const { data } = useContext(DataContext);
  const { preset } = useContext(PresetContext);

  const exportFile = () => {
    if (preset.export === "csv") {
      const config = {
        delimiter: preset.symbol ? preset.symbol : ",",
        header: true,
        skipEmptyLines: true,
      };
      const result = unparse(data, config);

      const blob = new Blob([result], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");

      link.href = url;
      link.download = "data.csv";
      document.body.appendChild(link);
      link.click();
    } else {
    }
  };

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
