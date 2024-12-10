import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useContext } from "react";
import { ParserContext } from "@/context/parser-context";

export function SelectTag({
  label,
  selectedTag,
  onTagSelect,
}: {
  label: string;
  selectedTag: string | undefined;
  onTagSelect: (tag: string) => void;
}) {
  const { data } = useContext(ParserContext);
  return (
    <Select
      value={selectedTag}
      onValueChange={(tag: string) => {
        onTagSelect(tag);
      }}
    >
      <SelectTrigger>
        <span className="text-xs font-normal text-muted-foreground">
          {label}:
        </span>
        <SelectValue placeholder="Select Tag..." />
      </SelectTrigger>
      <SelectContent>
        {Object.keys(data.records).map((tag) => (
          <SelectItem key={tag} value={tag}>
            {tag}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
