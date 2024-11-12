import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useContext, useEffect, useState } from "react";
import {
  Form,
  FormControl,
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

import { Cross2Icon, GearIcon, PlusCircledIcon } from "@radix-ui/react-icons";
import { SelectImportFormat } from "@/components/select-import-format";
import { ScrollArea, ScrollAreaViewport } from "@/components/ui/scroll-area";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ParserConfig, ParserConfigSchema } from "@/types/schemas";
import { PresetContext } from "@/context/preset-context";
import { Label } from "@/components/ui/label";
import { FloatingLabelInput } from "@/components/ui/floating-label-input";

function AccordionItemComponent({ record }: { record: string }) {
  const { control } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    name: `${record}.fields`,
    control: control,
  });

  return (
    <AccordionItem value={record}>
      <AccordionTrigger className="flex gap-x-2 text-xs font-normal capitalize text-muted-foreground">
        {record}
        <span className="ml-auto">{`${Object.values(
          useWatch({
            control: control,
            name: `${record}.fields`,
            defaultValue: [
              {
                property: "",
                width: 0,
              },
            ],
          }),
        ).reduce(
          (total: number, field: any) => total + Number(field.width),
          0,
        )}`}</span>
      </AccordionTrigger>
      <AccordionContent className="space-y-1">
        <ScrollArea>
          <ScrollAreaViewport className="max-h-[400px]">
            {fields.map((field, index) => (
              <div
                key={field.id}
                className="mr-4 flex flex-row items-center gap-x-2"
              >
                <FormField
                  control={control}
                  name={`${record}.fields.${index}.property`}
                  render={({ field }) => (
                    <FormItem className={"flex-1"}>
                      <FormControl>
                        <FloatingLabelInput label="Field" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={control}
                  name={`${record}.fields.${index}.width`}
                  render={({ field }) => (
                    <FormItem className={"flex-1"}>
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
                  className="ml-auto opacity-70 hover:text-destructive"
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
  );
}

export function ButtonParserConfig() {
  const { preset, setPreset } = useContext(PresetContext);
  const [open, setOpen] = useState(false);

  const form = useForm<ParserConfig>({
    resolver: zodResolver(ParserConfigSchema),
    defaultValues: {
      format: "delimited",
    },
  });

  function onSubmit(values: ParserConfig) {
    setPreset({
      ...preset,
      parser: values,
    });
    setOpen(false);
  }

  useEffect(() => {
    if (!preset.parser) return;
    form.reset(preset.parser);
  }, [preset.parser]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          className="flex h-7 w-[145px] flex-row items-center text-xs"
          variant="ghost"
        >
          <GearIcon className="mr-2" />
          Configure Parser
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[800px] sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Parser Configuration</DialogTitle>
          <DialogDescription>Configure the parser.</DialogDescription>
        </DialogHeader>
        <FormProvider {...form}>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className={"space-y-1"}
            >
              <FormField
                control={form.control}
                name={"format"}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <SelectImportFormat
                        value={field.value}
                        onFormatSelect={(format) => field.onChange(format)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {form.getValues().format === "fixed" && (
                <Accordion type="single" collapsible>
                  <AccordionItemComponent record="header" />
                  <AccordionItemComponent record="detail" />
                  <AccordionItemComponent record="trailer" />
                </Accordion>
              )}
              <div className="flex">
                <Button type="submit" className="ml-auto w-1/3">
                  Save
                </Button>
              </div>
            </form>
          </Form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
}
