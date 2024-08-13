import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function SelectSymbol({
  label,
  selectedSymbol,
  onSymbolSelect,
}: {
  label: string;
  selectedSymbol: string;
  onSymbolSelect: (symbol: string) => void;
}) {
  return (
    <Select
      value={selectedSymbol}
      onValueChange={(symbol) => onSymbolSelect(symbol)}
    >
      <SelectTrigger>
        <span className="font-normal text-xs text-muted-foreground">
          {label}:{" "}
        </span>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem key="," value=",">
          ,
        </SelectItem>
        <SelectItem key=";" value=";">
          ;
        </SelectItem>
        <SelectItem key=":" value=":">
          :
        </SelectItem>
        <SelectItem key="|" value="|">
          |
        </SelectItem>
        <SelectItem key="tab" value="\t">
          Tab
        </SelectItem>
        <SelectItem key="space" value=" ">
          Space
        </SelectItem>
        <SelectItem key="=" value="=">
          =
        </SelectItem>
      </SelectContent>
    </Select>
  );
}
