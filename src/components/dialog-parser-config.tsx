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
import { ParserConfig, ParserConfigSchema } from "@common/types/schemas";
import { PresetContext } from "@/context/preset-context";
import { FloatingLabelInput } from "@/components/ui/floating-label-input";
import { Selector } from "@/components/selector";

function AccordionItemComponent({ record }: { record: string }) {
  const { control } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    name: `${record}.fields`,
    control: control,
  });

  return (
    <AccordionItem value={record}>
      <AccordionTrigger className="text-muted-foreground flex gap-x-2 text-xs font-normal capitalize">
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
          <ScrollAreaViewport className="max-h-[300px]">
            {fields.map((field, index) => (
              <div
                key={field.id}
                className="mr-4 flex flex-row items-center gap-x-2"
              >
                <FormField
                  control={control}
                  name={`${record}.fields.${index}.property`}
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
                  control={control}
                  name={`${record}.fields.${index}.width`}
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
  );
}

export function DialogParserConfig({
  children,
}: {
  children: React.ReactNode;
}) {
  const { preset, setPreset } = useContext(PresetContext);
  const [open, setOpen] = useState(false);

  const form = useForm<ParserConfig>({
    resolver: zodResolver(ParserConfigSchema),
    defaultValues: { ...preset.parser },
  });

  const format = useWatch({
    control: form.control,
    name: "format",
  });

  function onSubmit(values: ParserConfig) {
    setPreset({
      ...preset,
      parser: values,
    });
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          {children}
        </DialogTrigger>
      <DialogContent className="max-h-[75%] max-w-[50%] overflow-auto">
        <DialogHeader>
          <DialogTitle>Parser Config</DialogTitle>
          <DialogDescription>
            Configure the parser to read a file correctly.
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
                  <AccordionItemComponent record="header" />
                  <AccordionItemComponent record="detail" />
                  <AccordionItemComponent record="trailer" />
                </Accordion>
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
