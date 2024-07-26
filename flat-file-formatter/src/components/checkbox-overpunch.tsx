import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

export function CheckboxOverpunch({
  defaultValue,
  onCheckedChange,
}: {
  defaultValue: boolean;
  onCheckedChange: (checked: boolean) => void;
}) {
  return (
    <div className="flex items-center space-x-2">
      <Checkbox
        id="overpunch"
        defaultChecked={defaultValue}
        onCheckedChange={(checked: boolean) => onCheckedChange(checked)}
      />
      <Label className="text-sm font-medium">Overpunch</Label>
    </div>
  );
}
