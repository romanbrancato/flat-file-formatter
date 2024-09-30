import { useContext, useMemo, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Pencil2Icon } from "@radix-ui/react-icons";
import { FormGroups } from "@/components/forms/form-groups";
import { Label } from "@/components/ui/label";
import { tokenize } from "@/lib/utils";
import path from "node:path";
import { ParserContext } from "@/context/parser-context";
import { Badge } from "@/components/ui/badge";

export function ButtonOutputGroups() {
  const { params } = useContext(ParserContext);
  const [open, setOpen] = useState(false);

  const tokens = useMemo(() => {
    return params?.file ? tokenize(path.parse(params.file.name).name) : [];
  }, [params?.file]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="w-full border-dashed">
          <Pencil2Icon className="mr-2" />
          Configure Output
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[800px] sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Configure Output</DialogTitle>
          <DialogDescription className="flex flex-row items-center justify-between">
            Each group will be written to a separate file.
          </DialogDescription>
        </DialogHeader>
        <Label className="flex flex-wrap gap-x-2 gap-y-1 whitespace-nowrap font-mono">
          {tokens.map((token, index) => (
            <Badge key={index} className="hover:bg-primary">
              {index}: {token}
            </Badge>
          ))}
        </Label>
        <FormGroups />
      </DialogContent>
    </Dialog>
  );
}
