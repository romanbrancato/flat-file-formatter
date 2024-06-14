"use client";
import { Share2Icon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useContext } from "react";
import { DataContext } from "@/context/data-context";
import { PresetContext } from "@/context/preset-context";
import Papa from "papaparse";
import { stringify } from "@evologi/fixed-width";

export function ExportFileButton() {
  const { data, name } = useContext(DataContext);
  const { preset } = useContext(PresetContext);

  const exportFile = () => {
    let flatData;
    try {
      // CSV Export
      if (preset.export === "csv") {
        const config = {
          delimiter: preset.symbol,
          header: preset.header,
          skipEmptyLines: true,
        };
        flatData = Papa.unparse(data, config);
      } else {
        // Fixed Width Export
        const config = preset.order.map((field) => {
          const width = preset.widths.find((widths) => field in widths)?.[
            field
          ];
          if (!width) throw new Error(`Width not found for field: ${field}`);
          return {
            property: field,
            width: width,
            align: preset.align,
          };
        });

        let headerLine = "";
        if (preset.header) {
          if (preset.align === "right") {
            headerLine =
              config
                .map((field) =>
                  field.property.padStart(field.width, preset.symbol),
                )
                .join("") + "\n";
          } else {
            headerLine =
              config
                .map((field) =>
                  field.property.padEnd(field.width, preset.symbol),
                )
                .join("") + "\n";
          }
        }

        flatData =
          headerLine +
          stringify(data, {
            pad: preset.symbol,
            fields: config,
          });
      }
    } catch (error: any) {
      toast.error("Failed to Export File", { description: error.message });
      return;
    }

    const url = URL.createObjectURL(new Blob([flatData]));
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `${name}.${preset.export}`);
    link.click();
  };

  return (
    <Button
      onClick={() => exportFile()}
      disabled={data.length === 0}
      className="gap-x-2 md:mt-auto"
    >
      <Share2Icon />
      Export File
    </Button>
  );
}
