import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useContext, useEffect, useMemo, useState } from "react";
import { Form, FormControl, FormDescription, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { FormProvider, useFieldArray, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Cross2Icon, PlusCircledIcon } from "@radix-ui/react-icons";
import { ScrollArea, ScrollAreaViewport } from "@/components/ui/scroll-area";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { LoadConfig, LoadConfigSchema } from "@common/types/preset";
import { PresetContext } from "@/context/preset";
import { FloatingLabelInput } from "@/components/ui/floating-label-input";
import { Selector } from "@/components/selector";
import { useTables } from "@/context/tables";
import { loadDataIntoTable } from "@common/lib/load";
import { toast } from "sonner";
import { usePGlite } from "@/context/db";

export function DialogLoad({ children }: { children: React.ReactNode }) {
  const db = usePGlite();
  const { tables, updateTables } = useTables();
  const { preset, setPreset, delimited } = useContext(PresetContext);
  const [open, setOpen] = useState(false);

  // Derive the current load config index from which tables already exist.
  // Find the first preset load config whose tablename hasn't been created yet.
  // Falls back to 0 (the first config) if no tables exist or no preset loads are defined.
  const presetIndex = useMemo(() => {
    const existingTableNames = Object.keys(tables);
    const nextIndex = preset.load.findIndex(
      (loadConfig) => !existingTableNames.includes(loadConfig.tablename)
    );
    // If all tables already exist (or no load configs defined), default to 0
    return nextIndex === -1 ? 0 : nextIndex;
  }, [tables, preset.load]);

  const form = useForm<LoadConfig>({
    resolver: zodResolver(LoadConfigSchema),
    defaultValues: delimited
  });

  // Reset the form whenever the derived index changes (e.g. after a table is
  // successfully loaded and `tables` updates, or when the dialog reopens).
  useEffect(() => {
    if (preset.load[presetIndex]) {
      form.reset(preset.load[presetIndex]);
    }
  }, [presetIndex]);

  const format = useWatch({
    control: form.control,
    name: "format"
  });

  const widths = useWatch({
    control: form.control,
    name: `widths.fields`,
    defaultValue: [{ property: "", width: 0 }]
  });

  const totalWidth = useMemo(() =>
      widths.reduce((total, field) => total + Number(field.width), 0),
    [widths]
  );

  const { fields, append, remove } = useFieldArray({
    name: `widths.fields`,
    control: form.control
  });

  async function combineFiles(files: File[], isDelimited: boolean): Promise<Uint8Array> {
    let combinedText = "";
    let header: string | null = null;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const text = await file.text();

      if (!text.trim()) continue;

      const normalized = text.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
      const lines = normalized.split("\n");

      if (lines.length > 0 && lines[lines.length - 1] === "") {
        lines.pop();
      }

      if (isDelimited) {
        if (i === 0) {
          header = lines[0];
          combinedText = lines.join("\n");
        } else {
          const startIndex =
            lines.length > 0 && header && lines[0].trim() === header.trim() ? 1 : 0;
          const dataLines = lines.slice(startIndex);
          if (dataLines.length > 0) {
            combinedText += "\n" + dataLines.join("\n");
          }
        }
      } else {
        if (i === 0) {
          combinedText = lines.join("\n");
        } else {
          if (lines.length > 0) {
            combinedText += "\n" + lines.join("\n");
          }
        }
      }
    }

    return new TextEncoder().encode(combinedText);
  }

  function onSubmit(values: LoadConfig) {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".txt, .csv, .dat";
    input.multiple = true;

    input.onchange = async (e) => {
      const files = (e.target as HTMLInputElement).files;

      if (!files || files.length === 0) return;

      const filesArray = Array.from(files);
      (e.target as HTMLInputElement).value = "";

      try {
        const isDelimited = values.format === "delimited";
        const combinedData = await combineFiles(filesArray, isDelimited);
        const result = await loadDataIntoTable(combinedData, db, values);

        if (result.success) {
          // updateTables() will refresh `tables`, which updates presetIndex
          // automatically via the useMemo above.
          setPreset((prev) => ({
            ...prev,
            load: [...prev.load, values]
          }));
          updateTables();
          setOpen(false);
        } else {
          toast.error("Failed to load file", { description: result.error });
          console.error("Failed to load file:", result.error);
        }
      } catch (error) {
        toast.error("Error processing files", {
          description: error instanceof Error ? error.message : "Unknown error"
        });
        console.error("Error processing files:", error);
      }
    };

    input.click();
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-h-[75%] max-w-[50%] overflow-auto">
        <DialogHeader>
          <DialogTitle>Load Table From File</DialogTitle>
          <DialogDescription>
            Configure how to load a table from a file. Multiple files can be selected and will be combined.
          </DialogDescription>
        </DialogHeader>
        <FormProvider {...form}>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-col gap-y-2"
            >
              <FormField
                control={form.control}
                name={"tablename"}
                defaultValue=""
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <FloatingLabelInput label="Table Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={"format"}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Selector
                        label={"format"}
                        selected={field.value}
                        options={[
                          { label: "delimited", value: "delimited" },
                          { label: "fixed", value: "fixed" }
                        ]}
                        onSelect={(format) => { field.onChange(format); }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {format === "delimited" && (
                <FormField
                  control={form.control}
                  name={"delimiter"}
                  defaultValue=""
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <FloatingLabelInput label="Delimiter" {...field} />
                      </FormControl>
                      <FormDescription>If autodetection fails to work</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              {format === "fixed" && (
                <Accordion type="single" collapsible>
                  <AccordionItem value="widths">
                    <AccordionTrigger className="text-muted-foreground flex gap-x-2 text-xs capitalize">
                      widths
                      <span className="ml-auto">{totalWidth}</span>
                    </AccordionTrigger>
                    <AccordionContent className="space-y-1">
                      <ScrollArea>
                        <ScrollAreaViewport className="max-h-[300px]">
                          {fields.map((field, index) => (
                            <div key={field.id} className="mr-4 flex flex-row items-center gap-x-2">
                              <FormField
                                control={form.control}
                                name={`widths.fields.${index}.property`}
                                render={({ field }) => (
                                  <FormItem className="flex-1">
                                    <FormControl>
                                      <FloatingLabelInput label="Field" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <FormField
                                control={form.control}
                                name={`widths.fields.${index}.width`}
                                render={({ field }) => (
                                  <FormItem className="flex-1">
                                    <FormControl>
                                      <FloatingLabelInput {...field} label="Width" type="number" min={0} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <Cross2Icon
                                className="hover:text-destructive ml-auto opacity-70"
                                onClick={() => remove(index)}
                              />
                            </div>
                          ))}
                        </ScrollAreaViewport>
                      </ScrollArea>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full border-dashed"
                        onClick={(event) => {
                          event.preventDefault();
                          append({ property: "", width: 0 });
                        }}
                      >
                        <PlusCircledIcon className="mr-2" />
                        Additional Field
                      </Button>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              )}
              <FormField
                control={form.control}
                name={"skipRows"}
                defaultValue=""
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <FloatingLabelInput label="Skip Rows" {...field} />
                    </FormControl>
                    <FormDescription>
                      Enter row numbers to skip, separated by commas. Use a colon to indicate a range e.g., [0,2:4,6,-1]
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
                <Button type="submit" className="w-1/3 ml-auto">
                  Choose File(s)
                </Button>
            </form>
          </Form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
}