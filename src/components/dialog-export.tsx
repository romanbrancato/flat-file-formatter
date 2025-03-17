import { useFieldArray, useForm } from "react-hook-form";
import { ScrollArea, ScrollAreaViewport } from "@/components/ui/scroll-area";
import { Cross2Icon, PlusCircledIcon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { useContext, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { FloatingLabelInput } from "@/components/ui/floating-label-input";
import { PresetContext } from "@/context/preset";
import { Export, ExportSchema } from "@common/types/preset";
import { zodResolver } from "@hookform/resolvers/zod";
import { SqlTextArea } from "./sql-text-area";
import { handleExport } from "@common/lib/export";
import { usePGlite } from "@electric-sql/pglite-react";
import { download, minifySQL } from "@/lib/utils";
import { toast } from "sonner";

export function DialogExport({
  children,
}: {
  children: React.ReactNode;
}) {
  const db = usePGlite();
  const { preset, setPreset } = useContext(PresetContext);
  const [open, setOpen] = useState(false);

  const form = useForm<Export>({
    resolver: zodResolver(ExportSchema),
    defaultValues: { ...preset.export },
  });

  const { fields, append, remove } = useFieldArray({
    name: `files`,
    control: form.control
    });

    async function onSubmit(values: Export) {
      const minified = {
        ...values,
        files: values.files.map(file => ({
          ...file,
          query: minifySQL(file.query)
        }))
      };
      
      const result = await handleExport(db, minified, preset.format);
      
      if (result.success && result.files) {
        result.files.map((file) => {
          download(file.dataString, file.name, "text/plain");
        });
        
        setPreset((prev) => ({ ...prev, export: minified }));
        setOpen(false);
      } else {
        toast.error("Failed to download file", {
          description: result.error,
        });
        console.error("Failed download:", result.error);
      }
    }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-h-[75%] max-w-[50%] overflow-auto">
        <DialogHeader>
          <DialogTitle>Export</DialogTitle>
          <DialogDescription className="flex flex-row items-center justify-between">
            Define files and their contents to be exported. 
            <br />
            Each query must return a column named [row_data] where each row is a JSON object.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-y-1"
          >
            <ScrollArea>
              <ScrollAreaViewport className="max-h-[400px]">
              <div className="flex flex-col gap-y-1">
                {fields.map((field, index) => (
                  <div
                    className="hover:border-muted-foreground mr-4 flex border p-4"
                    key={field.id}
                  >
                    <div className="flex-1 flex-row space-y-1">
                      <FormField
                        control={form.control}
                        name={`files.${index}.filename`}
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <FloatingLabelInput
                                defaultValue={field.value}
                                label="File Name"
                                onBlur={(e) => field.onChange(e)}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`files.${index}.query`}
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <SqlTextArea
                                value={field.value}
                                onChange={field.onChange}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <Cross2Icon
                      className="hover:text-destructive ml-auto opacity-70"
                      onClick={() => remove(index)}
                    />
                  </div>
                ))}
                  </div>
              </ScrollAreaViewport>
            </ScrollArea>
            <div className="flex flex-row content-center justify-between">
              <Button
                variant="outline"
                size="sm"
                className="w-1/3 border-dashed"
                onClick={(event) => {
                  event.preventDefault();
                  append({ filename: "", query: ""});
                }}
              >
                <PlusCircledIcon className="mr-2" />
                Add File
              </Button>
              <Button type="submit" className="w-1/3">
                Export
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
