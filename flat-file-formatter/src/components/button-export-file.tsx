"use client";
import { Share2Icon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useContext, useEffect } from "react";
import { PresetContext } from "@/context/preset-context";
import Papa from "papaparse";
import { stringify } from "@evologi/fixed-width";
import { download } from "@/lib/utils";
import { ModeContext } from "@/context/mode-context";
import { ParserContext } from "@/context/parser-context";
import { Data, MultiFormatConfig } from "@/lib/parser-functions";
import { BatchParserContext } from "@/context/batch-parser-context";

export function ButtonExportFile({
  files,
  setFiles,
  config,
}: {
  files?: File[];
  setFiles?: (files: File[]) => void;
  config?: MultiFormatConfig;
}) {
  const { mode } = useContext(ModeContext);
  const {
    isReady,
    data: batchData,
    setParams,
  } = useContext(BatchParserContext);
  const { data } = useContext(ParserContext);
  const { preset } = useContext(PresetContext);

  const exportBatch = () => {
    if (!files || !config) return;
    setParams({
      files: files,
      config: config,
      preset: preset,
    });
  };

  useEffect(() => {
    if (!isReady) return;
    batchData.forEach((data) => {
      exportFile(data);
    });
    if (setFiles) setFiles([]);
  }, [isReady]);

  const exportFile = (data: Data) => {
    let flatData;
    try {
      if (preset.format === "delimited") {
        const config = {
          delimiter: preset.symbol,
          header: preset.header,
          skipEmptyLines: true,
        };
        flatData = Papa.unparse(data.rows, config);
      } else {
        const fields = Object.keys(data.rows[0]);
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
          stringify(data.rows, {
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
      data.name,
      preset.format === "fixed" ? "txt" : preset.export,
    );
  };

  return (
    <Button
      onClick={mode === "batch" ? exportBatch : () => exportFile(data)}
      className="gap-x-2 md:mt-auto w-full"
    >
      <Share2Icon />
      {mode === "batch" ? "Export Files" : "Export File"}
    </Button>
  );
}
