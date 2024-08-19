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
import { useFieldArray, useForm, useWatch } from "react-hook-form";
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

export function ButtonParserConfig() {
  const { preset, setPreset } = useContext(PresetContext);
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState<File>();

  const form = useForm<ParserConfig>({
    resolver: zodResolver(ParserConfigSchema),
    defaultValues: {
      format: "delimited",
    },
  });

  const {
    fields: fieldsHeader,
    append: appendHeader,
    remove: removeHeader,
  } = useFieldArray({
    name: "header.fields",
    control: form.control,
  });

  const {
    fields: fieldsDetail,
    append: appendDetail,
    remove: removeDetail,
  } = useFieldArray({
    name: "detail.fields",
    control: form.control,
  });
  const {
    fields: fieldsTrailer,
    append: appendTrailer,
    remove: removeTrailer,
  } = useFieldArray({
    name: "trailer.fields",
    control: form.control,
  });

  const headerValues = useWatch({
    control: form.control,
    name: "header.fields",
    defaultValue: [
      {
        property: "",
        width: 0,
      },
    ],
  });
  const detailValues = useWatch({
    control: form.control,
    name: "detail.fields",
    defaultValue: [
      {
        property: "",
        width: 0,
      },
    ],
  });
  const trailerValues = useWatch({
    control: form.control,
    name: "trailer.fields",
    defaultValue: [
      {
        property: "",
        width: 0,
      },
    ],
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
    form.setValue("format", preset.parser.format);
    if (preset.parser.format === "fixed") {
      preset.parser.header?.fields.forEach((field) => {
        appendHeader(field);
      });
      preset.parser.detail.fields.forEach((field) => {
        appendDetail(field);
      });
      preset.parser.trailer?.fields.forEach((field) => {
        appendTrailer(field);
      });
    }
  }, [preset.parser]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="w-full border-dashed">
          <GearIcon className="mr-2" />
          Configure Parser
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[800px]">
        <DialogHeader>
          <DialogTitle>Parser Configuration</DialogTitle>
          <DialogDescription>Configure the parser.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
            <FormField
              control={form.control}
              name={"format"}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <SelectImportFormat
                      value={field.value}
                      onFormatSelect={(format) =>
                        form.setValue("format", format, {
                          shouldValidate: true,
                        })
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {form.getValues().format === "fixed" && (
              <>
                <Accordion type="single" collapsible>
                  <AccordionItem value="header">
                    <AccordionTrigger className="flex text-xs font-normal text-muted-foreground gap-x-2">
                      Header Record
                      <span className="ml-auto">{`${Object.values(headerValues).reduce((total, field) => total + Number(field.width), 0)}`}</span>
                    </AccordionTrigger>
                    <AccordionContent>
                      <ScrollArea>
                        <ScrollAreaViewport className="max-h-[400px]">
                          {fieldsHeader.map((field, index) => (
                            <div
                              key={field.id}
                              className="flex flex-row gap-x-1 mb-1 items-center"
                            >
                              <FormField
                                control={form.control}
                                name={`header.fields.${index}.property`}
                                render={({ field }) => (
                                  <FormItem className="flex-1">
                                    <FormControl>
                                      <Input {...field} placeholder="Field" />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <FormField
                                control={form.control}
                                name={`header.fields.${index}.width`}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormControl>
                                      <Input
                                        {...field}
                                        placeholder="Width"
                                        type="number"
                                        min={0}
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <Cross2Icon
                                className="hover:text-destructive mx-auto opacity-70"
                                onClick={() => removeHeader(index)}
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
                          appendHeader({ property: "", width: 0 });
                        }}
                      >
                        <PlusCircledIcon className="mr-2" />
                        Add Field
                      </Button>
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="detail">
                    <AccordionTrigger className="flex text-xs font-normal text-muted-foreground gap-x-2">
                      Detail Record
                      <span className="ml-auto">{`${Object.values(detailValues).reduce((total, field) => total + Number(field.width), 0)}`}</span>
                    </AccordionTrigger>
                    <AccordionContent>
                      <ScrollArea>
                        <ScrollAreaViewport className="max-h-[400px]">
                          {fieldsDetail.map((field, index) => (
                            <div
                              key={field.id}
                              className="grid grid-cols-7 gap-x-1 mb-1 items-center"
                            >
                              <FormField
                                control={form.control}
                                name={`detail.fields.${index}.property`}
                                render={({ field }) => (
                                  <FormItem className="col-span-5">
                                    <FormControl>
                                      <Input {...field} placeholder="Field" />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <FormField
                                control={form.control}
                                name={`detail.fields.${index}.width`}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormControl>
                                      <Input
                                        {...field}
                                        placeholder="Width"
                                        type="number"
                                        min={0}
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <Cross2Icon
                                className="hover:text-destructive mx-auto opacity-70"
                                onClick={() => removeDetail(index)}
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
                          appendDetail({ property: "", width: 0 });
                        }}
                      >
                        <PlusCircledIcon className="mr-2" />
                        Add Field
                      </Button>
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="trailer">
                    <AccordionTrigger className="flex text-xs font-normal text-muted-foreground gap-x-2">
                      Trailer Record
                      <span className="ml-auto">{`${Object.values(trailerValues).reduce((total, field) => total + Number(field.width), 0)}`}</span>
                    </AccordionTrigger>
                    <AccordionContent>
                      <ScrollArea>
                        <ScrollAreaViewport className="max-h-[400px]">
                          {fieldsTrailer.map((field, index) => (
                            <div
                              key={field.id}
                              className="grid grid-cols-7 gap-x-1 mb-1 items-center"
                            >
                              <FormField
                                control={form.control}
                                name={`trailer.fields.${index}.property`}
                                render={({ field }) => (
                                  <FormItem className="col-span-5">
                                    <FormControl>
                                      <Input {...field} placeholder="Field" />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <FormField
                                control={form.control}
                                name={`trailer.fields.${index}.width`}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormControl>
                                      <Input
                                        {...field}
                                        placeholder="Width"
                                        type="number"
                                        min={0}
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <Cross2Icon
                                className="hover:text-destructive mx-auto opacity-70"
                                onClick={() => removeTrailer(index)}
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
                          appendTrailer({ property: "", width: 0 });
                        }}
                      >
                        <PlusCircledIcon className="mr-2" />
                        Add Field
                      </Button>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </>
            )}
            <div className="flex">
              <Button type="submit" className="w-1/3 ml-auto">
                Save
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
