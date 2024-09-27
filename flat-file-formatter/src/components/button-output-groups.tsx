import { useState } from "react";
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

export function ButtonOutputGroups() {
  const [open, setOpen] = useState(false);

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
        <FormGroups />
      </DialogContent>
    </Dialog>
  );
}
