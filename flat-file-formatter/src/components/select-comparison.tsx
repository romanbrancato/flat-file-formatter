import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function SelectComparison({
  selectedComparison,
  onComparisonSelect,
}: {
  selectedComparison: "<" | "<=" | "=" | ">=" | ">";
  onComparisonSelect: (comparison: "<" | "<=" | "=" | ">=" | ">") => void;
}) {
  return (
    <Select
      value={selectedComparison}
      onValueChange={(comparison: "<" | "=" | ">") => {
        onComparisonSelect(comparison);
      }}
    >
      <SelectTrigger className="text-xs">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem key="<" value="<" className="text-xs">
          {`<`}
        </SelectItem>
        <SelectItem key="<=" value="<=" className="text-xs">
          {`<=`}
        </SelectItem>
        <SelectItem key="=" value="=" className="text-xs">
          =
        </SelectItem>
        <SelectItem key=">=" value=">=" className="text-xs">
          {`>=`}
        </SelectItem>
        <SelectItem key=">" value=">" className="text-xs">
          {`>`}
        </SelectItem>
      </SelectContent>
    </Select>
  );
}
