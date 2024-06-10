import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useContext } from "react";
import { PresetContext } from "@/context/preset-context";

export function PadPositionRadio() {
  const { preset, setPadPos } = useContext(PresetContext);

  return (
    <RadioGroup
      defaultValue={preset.padPos}
      onValueChange={(value) => setPadPos(value)}
      className="grid grid-cols-2 gap-2"
    >
      <div>
        <RadioGroupItem value="start" id="start" className="peer sr-only" />
        <Label
          htmlFor="start"
          className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover px-4 py-2 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
        >
          Start
        </Label>
      </div>
      <div>
        <RadioGroupItem value="end" id="end" className="peer sr-only" />
        <Label
          htmlFor="end"
          className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover px-4 py-2 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
        >
          End
        </Label>
      </div>
    </RadioGroup>
  );
}
