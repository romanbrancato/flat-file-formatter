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
import { usePGlite } from "@/context/pglite";
import { toast } from "sonner";
import { Checkbox } from "@/components/ui/checkbox";
import { runQueriesFromPreset } from "@common/lib/preset";
import { handleExport } from "@common/lib/export";
import { download } from "@/lib/utils";

export function DialogLoad({ children }: { children: React.ReactNode }) {
  const db = usePGlite();
  const { updateTables } = useTables();
  const { preset, setPreset } = useContext(PresetContext);
  const [open, setOpen] = useState(false);
  const [presetIndex, setPresetIndex] = useState(0);
  const [fullProcess, setFullProcess] = useState(!!preset.name);

  useEffect(() => {
    form.reset(preset.load[presetIndex]);
  }, [presetIndex]);

  const form = useForm<LoadConfig>({
    resolver: zodResolver(LoadConfigSchema),
    defaultValues: preset.load[presetIndex]
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

  function onSubmit(values: LoadConfig) {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".txt, .csv";
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      // Reset input value to allow re-selecting same file
      (e.target as HTMLInputElement).value = "";

      const reader = new FileReader();
      reader.onload = async () => {
        const arrayBuffer = reader.result as ArrayBuffer;
        const uint8Array = new Uint8Array(arrayBuffer);
        const result = await loadDataIntoTable(uint8Array, db, values);
        if (result.success) {
          if (fullProcess) {
            const queriesResult = await runQueriesFromPreset(db, preset.queries);
            if (!queriesResult.success) {
              toast.error("Failed to run preset queries", {
                description: result.error
              });
              console.error("Failed to run preset queries:", result.error);
            }
            const exportResult = await handleExport(db, preset.export, preset.format);
            if (!exportResult.success) {
              toast.error("Failed to export files", {
                description: result.error
              });
              console.error("Failed to export files:", result.error);
            }
            if (exportResult.files) {
              exportResult.files.forEach((file) => {
                download(file.dataString, file.name, "text/plain");
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
      };
      reader.onerror = (error) => {
        toast.error("Error reading file", {
          description: file.name
        });
        console.error("Error reading file:", file.name, error);
      };
      reader.readAsArrayBuffer(file);
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
            Configure how to load a table from a file.
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
                  Choose File
                </Button>
              </div>
            </form>
          </Form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
}
