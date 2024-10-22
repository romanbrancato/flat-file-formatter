import { Checkbox } from "@/components/ui/checkbox";

export function CheckboxOverpunch({
  checked,
  onCheckedChange,
}: {
  checked: boolean;
  onCheckedChange: (checked: string | boolean) => void;
}) {
  return (
    <div className="flex items-center space-x-2">
      <Checkbox
        id="overpunch"
        checked={checked}
        onCheckedChange={(checked) => onCheckedChange(checked)}
      />
      <label
        htmlFor="overpunch"
        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
      >
        Convert From Overpunch Format
      </label>
    </div>
  );
}
