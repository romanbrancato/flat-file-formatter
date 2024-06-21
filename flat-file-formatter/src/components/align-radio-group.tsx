import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useContext } from "react";
import { PresetContext } from "@/context/preset-context";

export function AlignRadioGroup() {
  const { preset, setAlign } = useContext(PresetContext);

  return (
    <RadioGroup
      value={preset.align}
      onValueChange={(value) => setAlign(value)}
      className="grid grid-cols-2 gap-2"
    >
      <div>
        <RadioGroupItem value="left" id="left" className="peer sr-only" />
        <Label
          htmlFor="left"
          className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover px-4 py-2 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
        >
          Left
        </Label>
      </div>
      <div>
        <RadioGroupItem value="right" id="right" className="peer sr-only" />
        <Label
          htmlFor="right"
          className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover px-4 py-2 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
        >
          Right
        </Label>
      </div>
    </RadioGroup>
  );
}
