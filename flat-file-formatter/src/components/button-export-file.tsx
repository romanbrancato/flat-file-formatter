import { Share2Icon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";
import { useContext } from "react";
import { PresetContext } from "@/context/preset-context";
import { ModeContext } from "@/context/mode-context";
import { ParserContext } from "@/context/parser-context";
import { exportFile } from "@/lib/parser-functions";

export function ButtonExportFile({ files }: { files: File[] }) {
  const { mode } = useContext(ModeContext);
  const { data, isReady } = useContext(ParserContext);
  const { preset } = useContext(PresetContext);

  return (
    <Button
      onClick={() => {
        exportFile(data, preset);
      }}
      className="w-full gap-x-2"
      disabled={
        (mode !== "single" && !preset.name) ||
        files?.length === 0 ||
        (mode !== "batch" && !isReady)
      }
    >
      <Share2Icon />
      Export File
    </Button>
  );
}
