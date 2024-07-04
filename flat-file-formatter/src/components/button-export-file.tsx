"use client";
import { Share2Icon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useContext } from "react";
import { PresetContext } from "@/context/preset-context";
import Papa from "papaparse";
import { stringify } from "@evologi/fixed-width";
import { download } from "@/lib/utils";
import { ModeContext } from "@/context/mode-context";
import { ParserContext } from "@/context/parser-context";

interface ExportFileButtonProps {
  files?: File[];
}

export function ButtonExportFile({ files }: ExportFileButtonProps) {
  const { mode } = useContext(ModeContext);
  const { data, fileName } = useContext(ParserContext);
  const { preset } = useContext(PresetContext);

  const exportBatch = () => {};

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
        const fields = Object.keys(data[0]);
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

    download(
      flatData,
      fileName,
      preset.format === "fixed" ? "txt" : preset.export,
    );
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
