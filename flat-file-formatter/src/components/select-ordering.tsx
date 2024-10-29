import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function SelectOrdering({
  selectedOrdering,
  onOrderingSelect,
}: {
  selectedOrdering: "in order" | "round robin";
  onOrderingSelect: (ordering: "in order" | "round robin") => void;
}) {
  return (
    <Select
      value={selectedOrdering}
      onValueChange={(algorithm: "in order" | "round robin") =>
        onOrderingSelect(algorithm)
      }
    >
      <SelectTrigger>
        <span className="text-xs font-normal text-muted-foreground">
          Ordering:{" "}
        </span>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem key="in order" value="in order">
          In Order
        </SelectItem>
        <SelectItem key="round robin" value="round robin">
          Round Robin
        </SelectItem>
      </SelectContent>
    </Select>
  );
}
