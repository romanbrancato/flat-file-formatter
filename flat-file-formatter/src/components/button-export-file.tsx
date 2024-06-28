"use client";
import { Share2Icon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useContext, useEffect, useState } from "react";
import { DataContext } from "@/context/data-context";
import { PresetContext } from "@/context/preset-context";
import Papa from "papaparse";
import { stringify } from "@evologi/fixed-width";
import { download } from "@/lib/utils";
import { ModeContext } from "@/context/mode-context";
import path from "node:path";

interface ExportFileButtonProps {
  files?: File[];
}

export function ButtonExportFile({ files }: ExportFileButtonProps) {
  const { mode } = useContext(ModeContext);
  const { data, name, setData, setName, applyPreset } = useContext(DataContext);
  const { preset } = useContext(PresetContext);
  const [queue, setQueue] = useState<
    { name: string; rows: Record<string, unknown>[] }[]
  >([]);

  const exportBatch = () => {
    if (!files || files.length === 0) {
      toast.error("Failed to Export Files", {
        description: "No files uploaded. Please upload files.",
      });
      return;
    }
    if (!preset.name) {
      toast.error("Failed to Export Files", {
        description: "No preset selected. Please select a preset.",
      });
      return;
    }
    files.forEach((file) => {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: function (results) {
          setQueue((queue) => [
            ...queue,
            {
              rows: results.data as Record<string, unknown>[],
              name: `${path.parse(file.name).name}`,
            },
          ]);
        },
      });
    });
  };

  useEffect(() => {
    console.log(queue);
  }, [queue]);

  const exportFile = () => {
    let flatData;
    try {
      if (preset.format === "delimited") {
        const config = {
          delimiter: preset.symbol,
          header: preset.header,
          skipEmptyLines: true,
        };
        flatData = Papa.unparse(data, config);
      } else {
        const fields = Object.keys(data[0] || {});
        const config = fields.map((field) => {
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
          const padFunction = preset.align === "right" ? "padStart" : "padEnd";
          headerLine =
            config
              .map((field) =>
                field.property[padFunction](field.width, preset.symbol),
              )
              .join("") + "\n";
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

    download(flatData, name, preset.format === "fixed" ? "txt" : preset.export);
  };

  return (
    <Button
      onClick={mode === "batch" ? exportBatch : exportFile}
      className="gap-x-2 md:mt-auto w-full"
    >
      <Share2Icon />
      {mode === "batch" ? "Export Files" : "Export File"}
    </Button>
  );
}
