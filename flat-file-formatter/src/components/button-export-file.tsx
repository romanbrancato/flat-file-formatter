import { Share2Icon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";
import { useContext } from "react";
import { PresetContext } from "@/context/preset-context";
import { ParserContext } from "@/context/parser-context";
import { exportFile } from "@/lib/parser-functions";
import path from "node:path";

export function ButtonExportFile({ files }: { files: File[] }) {
  const { data, params, isReady } = useContext(ParserContext);
  const { preset } = useContext(PresetContext);

  return (
    <Button
      onClick={() => {
        if (!params) return;
        exportFile(data, preset, path.parse(params.file.name).name);
      }}
      className="w-full gap-x-2"
      disabled={files?.length === 0 || !isReady}
    >
      <Share2Icon />
      Export File
    </Button>
  );
}
