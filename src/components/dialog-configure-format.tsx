import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useContext, useState } from "react";
import { PresetContext } from "@/context/preset-context";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { ScrollArea, ScrollAreaViewport } from "@/components/ui/scroll-area";
import { Selector } from "@/components/selector";
import { Button } from "@/components/ui/button";
import {
  FormProvider,
  useForm,
  useFormContext,
  useWatch,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Format, FormatSchema } from "@/common/types/schemas";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { DataProcessorContext } from "@/context/data-processor-context";

function TagAccordionItem({ tag, fields }: { tag: string; fields: string[] }) {
  const { setValue, control } = useFormContext();
  const { isReady, data } = useContext(DataProcessorContext);
  const [inheritedTag, setInheritedTag] = useState<string | undefined>(
    undefined,
  );

  const widths = useWatch({
    control,
    name: "widths",
  });

  return (
    <AccordionItem value={tag}>
      <AccordionTrigger className="flex gap-x-2 text-xs font-normal">
        {tag}
        <span className="ml-auto">
          {Object.values(
            useWatch({
              control,
              name: `widths.${tag}`,
              defaultValue: 0,
            }),
          ).reduce((total: number, width) => total + Number(width || 0), 0)}
        </span>
      </AccordionTrigger>
      <AccordionContent>
        <Selector
          label={"inheritance"}
          selected={inheritedTag}
          options={
            isReady
              ? Object.keys(data).map((key) => ({
                  label: key,
                  value: key,
                }))
              : []
          }
          onSelect={(selectedTag: string) => {
            fields.forEach((field) => {
              setValue(
                `widths.${tag}.${field}`,
                widths[selectedTag][field] || 0,
              );
            });
            setInheritedTag(selectedTag);
          }}
        />
        {fields.map((fieldName) => (
          <FormField
            control={control}
            name={`widths.${tag}.${fieldName}`}
            key={`${tag}${fieldName}`}
            render={({ field }) => (
              <FormItem className="mr-3 mt-2">
                <FormControl>
                  <div className="relative">
                    <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 transform text-xs font-normal text-muted-foreground">
                      {fieldName}
                    </span>
                    <Input
                      className="text-right [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                      defaultValue={field.value}
                      onWheel={(e) => {
                        e.target instanceof HTMLElement
                          ? e.target.blur()
                          : null;
                      }}
                      onBlur={(e) => field.onChange(e)}
                      type="number"
                      min={0}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        ))}
        <Separator />
      </AccordionContent>
    </AccordionItem>
  );
}

export function DialogConfigureFormat({
  children,
}: {
  children: React.ReactNode;
}) {
  const { preset, setPreset } = useContext(PresetContext);
  const { isReady, data } = useContext(DataProcessorContext);
  const [open, setOpen] = useState(false);

  const form = useForm<Format>({
    resolver: zodResolver(FormatSchema),
    defaultValues: { ...preset.format },
  });

  function onSubmit(values: Format) {
    setPreset({
      ...preset,
      format: values,
    });
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-h-[75%] max-w-[50%] overflow-auto">
        <DialogHeader>
          <DialogTitle>Format Configuration</DialogTitle>
          <DialogDescription>Configure the desired format.</DialogDescription>
        </DialogHeader>
        <FormProvider {...form}>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-col gap-y-1"
            >
              {preset.format.format === "fixed" && (
                <>
                  <FormField
                    control={form.control}
                    name="pad"
                    defaultValue="\s"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Selector
                            label="Padding"
                            selected={field.value}
                            options={[
                              { label: ",", value: "," },
                              { label: ";", value: ";" },
                              { label: ":", value: ":" },
                              { label: "|", value: "|" },
                              { label: "tab", value: "\t" },
                              { label: "space", value: " " },
                              { label: "=", value: "=" },
                            ]}
                            onSelect={(symbol) => field.onChange(symbol)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="align"
                    defaultValue="left"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Selector
                            label={"Alignment"}
                            selected={field.value}
                            options={[
                              { label: "left", value: "left" },
                              { label: "right", value: "right" },
                            ]}
                            onSelect={(align) => field.onChange(align)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <ScrollArea>
                    <ScrollAreaViewport className="max-h-[400px]">
                      <Accordion type="single" className="mr-4" collapsible>
                        {isReady &&
                          Object.keys(data).map((tag) => (
                            <TagAccordionItem
                              tag={tag}
                              fields={data[tag].fields}
                              key={tag}
                            />
                          ))}
                      </Accordion>
                    </ScrollAreaViewport>
                  </ScrollArea>
                </>
              )}
              {preset.format.format === "delimited" && (
                <FormField
                  control={form.control}
                  name="delimiter"
                  defaultValue=" "
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Selector
                          label="Delimiter"
                          selected={field.value}
                          options={[
                            { label: ",", value: "," },
                            { label: ";", value: ";" },
                            { label: ":", value: ":" },
                            { label: "|", value: "|" },
                            { label: "tab", value: "\t" },
                            { label: "space", value: " " },
                            { label: "=", value: "=" },
                          ]}
                          onSelect={(symbol) => field.onChange(symbol)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
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
