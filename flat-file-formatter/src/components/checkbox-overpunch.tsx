import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

export function CheckboxOverpunch({
  checked,
  onCheckedChange,
}: {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}) {
  return (
    <div className="flex items-center space-x-2">
      <Checkbox
        id="overpunch"
        checked={checked}
        onCheckedChange={(checked: boolean) => onCheckedChange(checked)}
      />
      <Label className="text-sm font-medium">OP</Label>
    </div>
  );
}
