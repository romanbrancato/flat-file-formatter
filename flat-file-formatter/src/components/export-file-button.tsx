"use client";
import { Share2Icon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";
import { useContext } from "react";
import { DataContext } from "@/context/data-context";
import { PresetContext } from "@/context/preset-context";
import Papa from "papaparse";
import { FixedWidthParser, ParseConfigInput } from "fixed-width-parser";
import { toast } from "sonner";

export function ExportFileButton() {
  const { data } = useContext(DataContext);
  const { preset } = useContext(PresetContext);

  const exportFile = () => {
    let result;
    try {
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
            const width = preset.widths.find((widths) => field in widths)?.[
              field
            ];
            if (!width) throw new Error(`Width not found for field: ${field}`);
            const column: ParseConfigInput = {
              name: field,
              start: start,
              width: width,
              padPosition: preset.padPos,
              padChar: preset.symbol,
            };
            start += width;
            return column;
          }),
        );
        result = fixedWidthParser.unparse(data);
      }
    } catch (error: any) {
      toast.error("Failed to Export File", { description: error.message });
      return;
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
    <Button
      onClick={() => exportFile()}
      disabled={data.length === 0}
      className="md:mt-auto"
    >
      <Share2Icon className="mr-2" />
      Export File
    </Button>
  );
}
