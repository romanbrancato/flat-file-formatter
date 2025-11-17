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
import { Checkbox } from "@/components/ui/checkbox";
import { runQueriesFromPreset } from "@common/lib/preset";
import { handleExport } from "@common/lib/export";
import { download } from "@/lib/utils";
import { usePGlite } from "@/context/db";

export function DialogLoad({ children }: { children: React.ReactNode }) {
  const db = usePGlite();
  const { updateTables } = useTables();
  const { preset, setPreset, delimited } = useContext(PresetContext);
  const [open, setOpen] = useState(false);
  const [presetIndex, setPresetIndex] = useState(0);
  const [fullProcess, setFullProcess] = useState(!!preset.name);

  useEffect(() => {
    form.reset(preset.load[presetIndex]);
  }, [presetIndex]);

  const form = useForm<LoadConfig>({
    resolver: zodResolver(LoadConfigSchema),
    defaultValues: delimited
  });

  const format = useWatch({
    control: form.control,
    name: "format"
  });

  const widths = useWatch({
    control: form.control,
    name: `widths.fields`,
    defaultValue: [
      {
        property: "",
        width: 0
      }
    ]
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

      // Normalize newlines to "\n"
      const normalized = text.replace(/\r\n/g, "\n").replace(/\r/g, "\n");

      // Split into lines
      const lines = normalized.split("\n");

      // Remove final empty line only if it exists (end-of-file newline)
      if (lines.length > 0 && lines[lines.length - 1] === "") {
        lines.pop();
      }

      if (isDelimited) {
        //
        // === DELIMITED CASE ===
        //
        if (i === 0) {
          // First file: keep entire file as-is
          header = lines[0];
          combinedText = lines.join("\n");
        } else {
          // For subsequent files: skip header line if it matches
          const startIndex =
            lines.length > 0 &&
            header &&
            lines[0].trim() === header.trim()
              ? 1
              : 0;

          const dataLines = lines.slice(startIndex);
          if (dataLines.length > 0) {
            combinedText += "\n" + dataLines.join("\n");
          }
        }
      } else {
        //
        // === FIXED-WIDTH CASE ===
        //
        // For fixed-width files, we simply concatenate line-by-line.
        // No header logic applies.
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
    input.accept = ".txt, .csv";
    input.multiple = true;

    input.onchange = async (e) => {
      const files = (e.target as HTMLInputElement).files;

      if (!files || files.length === 0) {
        return;
      }

      const filesArray = Array.from(files);

      (e.target as HTMLInputElement).value = "";

      try {
        const isDelimited = values.format === "delimited";

        const combinedData = await combineFiles(filesArray, isDelimited);

        const result = await loadDataIntoTable(combinedData, db, values);

        if (result.success) {
          if (fullProcess) {
            const queriesResult = await runQueriesFromPreset(db, preset.queries);
            if (!queriesResult.success) {
              toast.error("Failed to run preset queries", {
                description: queriesResult.error
              });
              console.error("Failed to run preset queries:", queriesResult.error);
            }
            const exportResult = await handleExport(db, preset.export, preset.format);
            if (!exportResult.success) {
              toast.error("Failed to export files", {
                description: exportResult.error
              });
              console.error("Failed to export files:", exportResult.error);
            }
            if (exportResult.files) {
              exportResult.files.forEach((file) => {
                download(file.dataString, file.name, preset.format.format === "delimited" ? "text/csv" : "text/plain");
              });
            }
          }
          setPreset((prev) => ({
            ...prev,
            load: [...prev.load, values]
          }));
          setPresetIndex(presetIndex + 1);
          updateTables();
          setOpen(false);

        } else {
          toast.error("Failed to load file", {
            description: result.error
          });
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
                        onSelect={(format) => {
                          field.onChange(format);
                        }}
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
                      <FormDescription>
                        If autodetection fails to work
                      </FormDescription>
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
                            <div
                              key={field.id}
                              className="mr-4 flex flex-row items-center gap-x-2"
                            >
                              <FormField
                                control={form.control}
                                name={`widths.fields.${index}.property`}
                                render={({ field }) => (
                                  <FormItem className="flex-1">
                                    <FormControl>
                                      <FloatingLabelInput
                                        label="Field"
                                        {...field}
                                      />
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
                                      <FloatingLabelInput
                                        {...field}
                                        label="Width"
                                        type="number"
                                        min={0}
                                      />
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
                      Enter row numbers to skip, separated by commas. Use a
                      colon to indicate a range e.g., [0,2:4,6,-1]
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex items-center justify-between">

                <div className="flex items-center space-x-2">
                  <Checkbox id="fullProcess" disabled={!preset.name}
                            checked={fullProcess}
                            onCheckedChange={(checked) => {
                              setFullProcess(!!checked);
                            }}
                  />
                  <label
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Run Preset + Export Result
                  </label>
                </div>

                <Button type="submit" className="w-1/3">
                  Choose File(s)
                </Button>
              </div>
            </form>
          </Form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
}