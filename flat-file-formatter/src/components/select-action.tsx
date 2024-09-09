import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function SelectAction({
  label,
  selectedAction,
  onActionSelect,
}: {
  label: string;
  selectedAction: string;
  onActionSelect: (action: string) => void;
}) {
  return (
    <Select
      value={selectedAction}
      onValueChange={(value) => {
        onActionSelect(value);
      }}
    >
      <SelectTrigger>
        <span className="text-xs font-normal text-muted-foreground">
          {label}:
        </span>
        <SelectValue placeholder="Select operation..." />
      </SelectTrigger>
      <SelectContent>
        <SelectItem key="setValue" value="setValue">
          Set Value
        </SelectItem>
        <SelectItem key="separate" value="separate">
          Separate
        </SelectItem>
        <SelectItem key="duplicate" value="duplicate">
          Duplicate
        </SelectItem>
        <SelectItem key="nothing" value="nothing">
          Do Nothing
        </SelectItem>
      </SelectContent>
    </Select>
  );
}
