import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

export function SelectFormat({
  selectedFormat,
  onFormatSelect,
}: {
  selectedFormat: "fixed" | "delimited";
  onFormatSelect: (operation: "fixed" | "delimited") => void;
}) {
  return (
    <RadioGroup
      value={selectedFormat}
      onValueChange={(format: "fixed" | "delimited") => onFormatSelect(format)}
      className="flex flex-row items-center w-full"
    >
      <div className="flex-1">
        <RadioGroupItem value="fixed" id="fixed" className="peer sr-only" />
        <Label
          htmlFor="fixed"
          className="flex flex-col items-center justify-between rounded-md border border-muted bg-popover p-2 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
        >
          Fixed
        </Label>
      </div>
      <div className="flex-1">
        <RadioGroupItem
          value="delimited"
          id="delimited"
          className="peer sr-only"
        />
        <Label
          htmlFor="delimited"
          className="flex flex-col items-center justify-between rounded-md border border-muted bg-popover p-2 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
        >
          Delimited
        </Label>
      </div>
    </RadioGroup>
  );
}
