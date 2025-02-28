import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useContext, useState } from "react";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import {
  FormProvider,
  useFieldArray,
  useForm,
  useFormContext,
  useWatch,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Cross2Icon, PlusCircledIcon } from "@radix-ui/react-icons";
import { ScrollArea, ScrollAreaViewport } from "@/components/ui/scroll-area";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { LoadConfig, LoadConfigSchema } from "@common/types/schemas";
import { PresetContext } from "@/context/preset";
import { FloatingLabelInput } from "@/components/ui/floating-label-input";
import { Selector } from "@/components/selector";

export function DialogLoadConfig({ children }: { children: React.ReactNode }) {
  const { preset, setPreset } = useContext(PresetContext);
  const [open, setOpen] = useState(false);

  const form = useForm<LoadConfig>({
    resolver: zodResolver(LoadConfigSchema),
    defaultValues: { ...preset.parser },
  });

  const format = useWatch({
    control: form.control,
    name: "format",
  });

  const widths = useWatch({
    control: form.control,
    name: `widths.fields`,
    defaultValue: [
      {
        property: "",
        width: 0,
      },
    ],
  })

  const totalWidth = widths.reduce((total: number, field: any) => total + Number(field.width), 0)

  const { fields, append, remove } = useFieldArray({
    name: `widths.fields`,
    control: form.control,
  });

  function onSubmit(values: LoadConfig) {
    setPreset({
      ...preset,
      parser: values,
    });
    setOpen(false);
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
                name={"name"}
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
                          { label: "fixed", value: "fixed" },
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
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <FloatingLabelInput label="Delimiter" {...field} />
                      </FormControl>
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
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <FloatingLabelInput label="Skip Rows" {...field} />
                    </FormControl>
                    <FormDescription>
                      Enter row numbers to skip, separated by commas. Use colons
                      to indicate a range e.g., "0,2:4,6,-1"{" "}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={"serialPrimaryKey"}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <FloatingLabelInput label="Serial Primary Key" {...field} />
                    </FormControl>
                    <FormDescription>
                      If left blank, an id column will be generated.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="ml-auto w-1/3">
                Save
              </Button>
            </form>
          </Form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
}
