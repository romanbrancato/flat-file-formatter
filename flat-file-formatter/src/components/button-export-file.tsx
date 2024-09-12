import { Share2Icon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";
import { useContext, useEffect } from "react";
import { PresetContext } from "@/context/preset-context";
import { download } from "@/lib/utils";
import { ModeContext } from "@/context/mode-context";
import { ParserContext } from "@/context/parser-context";
import { unparseData } from "@/lib/parser-functions";
import { BatchParserContext } from "@/context/batch-parser-context";
import { Data } from "@/types/schemas";

export function ButtonExportFile({
  files,
  setFiles,
}: {
  files?: File[];
  setFiles?: (files: File[]) => void;
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

  const exportFile = (data: Data) => {
    const flatData = unparseData(data, preset);
    if (flatData) {
      download(flatData.slice(0, 3).join("\n"), data.name, "txt");

      Object.keys(data.records)
        .slice(3)
        .forEach((key, idx) => {
          if (flatData[idx + 3]) {
            download(
              flatData[idx + 3],
              `${key.toUpperCase()}_${data.name}`,
              "txt",
            );
          }
        });
    }
  };

  const handleBatch = () => {
    if (!files || !preset.name) return;
    setBatchParams({
      files: files,
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

  return (
    <Button
      onClick={mode === "batch" ? handleBatch : () => exportFile(data)}
      className="gap-x-2 w-full"
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
