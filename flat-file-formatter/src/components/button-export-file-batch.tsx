import { Share2Icon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";
import { useContext, useEffect } from "react";
import { PresetContext } from "@/context/preset-context";
import { BatchParserContext } from "@/context/batch-parser-context";

export function ButtonExportFileBatch({ files }: { files: File[] }) {
  const { isBatchReady, data, setBatchParams } = useContext(BatchParserContext);
  const { preset } = useContext(PresetContext);

  const prepareBatch = () => {
    if (!files || !preset.name) return;
    setBatchParams({
      files: files,
      preset: preset,
    });
  };

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
