import { useContext, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { PresetContext } from "@/context/preset";
import { SqlTextArea } from "./sql-text-area";
import { usePGlite } from "@/context/pglite";
import { handleExport } from "@common/lib/export";
import { download, minifySQL } from "@/lib/utils";
import { toast } from "sonner";
import { format } from "sql-formatter";

export function DialogExport({
                               children
                             }: {
  children: React.ReactNode;
}) {
  const db = usePGlite();
  const { preset, setPreset } = useContext(PresetContext);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState(format(preset.export, { language: "postgresql" }) || "");

  const onSubmit = async () => {
    const minifiedQuery = minifySQL(query);

    const result = await handleExport(db, minifiedQuery, preset.format);

    if (result.success && result.files) {
      result.files.forEach((file) => {
        download(file.dataString, file.name, preset.format.format === "delimited" ? "text/csv" : "text/plain");
      });

      setPreset((prev) => ({ ...prev, export: minifiedQuery }));
      setOpen(false);
    } else {
      toast.error("Failed to download file", {
        description: result.error
      });
      console.error("Failed download:", result.error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-h-[75%] max-w-[50%] overflow-auto">
        <DialogHeader>
          <DialogTitle>Export</DialogTitle>
          <DialogDescription className="flex flex-row items-center justify-between">
            Query result must return a column named [filename] and a column named [data] containing a JSON object.
          </DialogDescription>
        </DialogHeader>

        <SqlTextArea
          value={query}
          onChange={(e) => setQuery(e)}
        />
        <Button
          onClick={onSubmit}
          className="w-1/2 ml-auto"
        >
          Export
        </Button>
      </DialogContent>
    </Dialog>
  );
}