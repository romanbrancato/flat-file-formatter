import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function SelectStatement({
  selectedStatement,
  onStatementSelect,
}: {
  selectedStatement: "if" | "if not";
  onStatementSelect: (statement: "if" | "if not") => void;
}) {
  return (
    <Select
      value={selectedStatement}
      onValueChange={(statement: "if" | "if not") => {
        onStatementSelect(statement);
      }}
    >
      <SelectTrigger className="text-xs">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem key="if" value="if" className="text-xs">
          IF
        </SelectItem>
        <SelectItem key="if not" value="if not" className="text-xs">
          IF NOT
        </SelectItem>
      </SelectContent>
    </Select>
  );
}
