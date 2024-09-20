import { PresetContext } from "@/context/preset-context";
import { MagicWandIcon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";
import { ParserContext } from "@/context/parser-context";
import { useContext } from "react";

export function ButtonApplyPreset() {
  const { preset } = useContext(PresetContext);
  const { applyPreset } = useContext(ParserContext);

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => applyPreset(preset)}
      disabled={!preset.name}
    >
      <MagicWandIcon />
    </Button>
  );
}
