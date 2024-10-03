import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function SelectAlgorithm({
  selectedAlgorithm,
  onAlgorithmSelect,
}: {
  selectedAlgorithm: "in order" | "round robin";
  onAlgorithmSelect: (algorithm: "in order" | "round robin") => void;
}) {
  return (
    <Select
      value={selectedAlgorithm}
      onValueChange={(algorithm: "in order" | "round robin") =>
        onAlgorithmSelect(algorithm)
      }
    >
      <SelectTrigger>
        <span className="text-xs font-normal text-muted-foreground">
          Algorithm:{" "}
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
