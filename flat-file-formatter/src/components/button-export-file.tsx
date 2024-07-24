"use client";
import { Share2Icon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";
import { useContext, useEffect } from "react";
import { PresetContext } from "@/context/preset-context";
import { download } from "@/lib/utils";
import { ModeContext } from "@/context/mode-context";
import { ParserContext } from "@/context/parser-context";
import { Data, unparseData } from "@/lib/parser-functions";
import { BatchParserContext } from "@/context/batch-parser-context";
import { Config } from "./button-parser-config";

export function ButtonExportFile({
  files,
  setFiles,
  config,
}: {
  files?: File[];
  setFiles?: (files: File[]) => void;
  config?: Config
}) {
  const { mode } = useContext(ModeContext);
  const {
    isBatchReady,
    data: batchData,
    setBatchParams,
    resetBatchParser,
  } = useContext(BatchParserContext);
  const { data, isReady } = useContext(ParserContext);
  const { preset } = useContext(PresetContext);

  const handleBatch = () => {
    if (!files || !config || !preset.name) return;
    setBatchParams({
      files: files,
      config: config,
      preset: preset,
    });
  };

  useEffect(() => {
    if (!isBatchReady) return;
    batchData.forEach((data) => {
      exportFile(data);
    });
    resetBatchParser();
    if (setFiles) setFiles([]);
  }, [isBatchReady]);

  const exportFile = (data: Data) => {
    const flatData = unparseData(data, preset);
    if (flatData) {
      download(
        flatData,
        data.name,
        preset.format === "fixed" ? "txt" : preset.export,
      );
    }
  };

  return (
    <Button
      onClick={mode === "batch" ? handleBatch : () => exportFile(data)}
      className="gap-x-2 md:mt-auto w-full"
      disabled={
        (mode !== "single" && !preset.name) ||
        files?.length === 0 ||
        (mode !== "batch" && !isReady)
      }
    >
      <Share2Icon />
      {mode === "batch" ? "Export Files" : "Export File"}
    </Button>
  );
}
