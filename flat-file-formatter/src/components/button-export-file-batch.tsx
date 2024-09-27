import { Share2Icon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";
import { useContext, useEffect } from "react";
import { PresetContext } from "@/context/preset-context";
import { exportFile } from "@/lib/parser-functions";
import { BatchParserContext } from "@/context/batch-parser-context";

export function ButtonExportFileBatch({
  files,
  setFiles,
}: {
  files: File[];
  setFiles: (files: File[]) => void;
}) {
  const { isBatchReady, data, setBatchParams, resetBatchParser } =
    useContext(BatchParserContext);
  const { preset } = useContext(PresetContext);

  const prepareBatch = () => {
    if (!files || !preset.name) return;
    setBatchParams({
      files: files,
      preset: preset,
    });
  };

  useEffect(() => {
    if (!isBatchReady) return;
    data.forEach((data) => {
      exportFile(data, preset);
    });
    resetBatchParser();
    setFiles([]);
  }, [isBatchReady]);

  return (
    <Button
      onClick={prepareBatch}
      className="w-full gap-x-2"
      disabled={files?.length === 0 || !isBatchReady}
    >
      <Share2Icon />
      Export Files
    </Button>
  );
}
