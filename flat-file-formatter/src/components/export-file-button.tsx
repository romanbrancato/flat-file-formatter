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
  const { data } = useContext(DataContext);
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

    const blob = new Blob([flatData]);
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
