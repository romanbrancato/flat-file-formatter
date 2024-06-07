import { PresetToolbar } from "@/components/preset-toolbar";
import { CSVTable } from "@/components/csv-table";
import { ExportOptions } from "@/components/export-options";
import { TableToolbar } from "@/components/table-toolbar";
import { Button } from "@/components/ui/button";
import { Share2Icon } from "@radix-ui/react-icons";
import { useContext } from "react";
import { DataContext } from "@/context/data-context";
import { PresetContext } from "@/context/preset-context";
import Papa from "papaparse";
import { FixedWidthParser } from "fixed-width-parser";

export function Editor() {
  const { data } = useContext(DataContext);
  const { preset } = useContext(PresetContext);

  const exportFile = () => {
    let result;
    if (preset.export === "csv") {
      const config = {
        delimiter: preset.symbol,
        header: true,
        skipEmptyLines: true,
      };
      result = Papa.unparse(data, config);
    } else {
      let start = 0;
      const fixedWidthParser = new FixedWidthParser(
        preset.order.map((field) => {
          const width = preset.widths.find((widths) => field in widths)[field];
          const column = {
            name: field,
            start: start,
            width: width,
            padPosition: "end",
          };
          start += width;
          return column;
        }),
      );
      console.log(fixedWidthParser);
      result = fixedWidthParser.unparse(data);
    }

    const blob = new Blob([result]);
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = `data.${preset.export}`;
    document.body.appendChild(link);
    link.click();
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
