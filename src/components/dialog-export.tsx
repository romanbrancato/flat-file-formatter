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
import { handleExport } from "@common/lib/export";
import { download, minifySQL } from "@/lib/utils";
import { toast } from "sonner";
import { format } from "sql-formatter";
import { usePGlite } from "@/context/db";

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
      const files = result.files.map((file) => ({
        content: file.dataString,
        filename: file.name
      }));

      const mimetype = preset.format.format === "delimited"
        ? (preset.format.txt ? "text/plain" : "text/csv")
        : "text/plain";

      await download(files, mimetype);

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
          <DialogDescription>
            The query must include a{" "}
            <code className="bg-muted text-foreground rounded px-1 py-0.5 font-mono text-xs">data</code>
            {" "}column of JSON row objects — use{" "}
            <code className="bg-muted text-foreground rounded px-1 py-0.5 font-mono text-xs">row_to_json</code>
            {" "}to produce them.
            <br/>
            Rows sharing a{" "}
            <code className="bg-muted text-foreground rounded px-1 py-0.5 font-mono text-xs">filename</code>
            {" "}are written to the same file; rows without one are written to "export".
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