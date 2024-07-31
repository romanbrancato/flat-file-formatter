import React, { useContext, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Pencil2Icon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { useForm, useWatch } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { ScrollArea, ScrollAreaViewport } from "@/components/ui/scroll-area";
import { zodResolver } from "@hookform/resolvers/zod";
import { Label } from "@/components/ui/label";
import { PresetContext, Widths, WidthsSchema } from "@/context/preset-context";
import { ParserContext } from "@/context/parser-context";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export function ButtonDefineWidths() {
  const { data, isReady } = useContext(ParserContext);
  const { preset, setPreset } = useContext(PresetContext);
  const [open, setOpen] = useState(false);

  const form = useForm<Widths>({
    resolver: zodResolver(WidthsSchema),
    defaultValues: {
      header: Object.fromEntries(
        Object.keys(data.header[0]).map((key) => [
          key,
          preset.widths?.header?.[key] ?? "",
        ]),
      ),
      detail: Object.fromEntries(
        Object.keys(data.detail[0]).map((key) => [
          key,
          preset.widths?.detail?.[key] ?? "",
        ]),
      ),
      trailer: Object.fromEntries(
        Object.keys(data.trailer[0]).map((key) => [
          key,
          preset.widths?.trailer?.[key] ?? "",
        ]),
      ),
    },
  });

  const headerValues = useWatch({ control: form.control, name: "header" });
  const detailValues = useWatch({ control: form.control, name: "detail" });
  const trailerValues = useWatch({ control: form.control, name: "trailer" });

  function onSubmit(values: Widths) {
    setPreset({ ...preset, widths: values });

    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="w-full border-dashed"
          disabled={!isReady}
        >
          <Pencil2Icon className="mr-2" />
          Define Widths
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[800px]">
        <DialogHeader>
          <DialogTitle>Define Widths</DialogTitle>
          <DialogDescription className="flex flex-row justify-between items-center">
            Define the widths of each field in characters.
            <Button onClick={form.handleSubmit(onSubmit)} className="w-1/3">
              Save
            </Button>
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <Accordion type="single" collapsible>
              <AccordionItem value="header">
                <AccordionTrigger className="flex text-xs font-normal text-muted-foreground gap-x-2">
                  Header Record
                  <span className="ml-auto">{`${Object.values(headerValues).reduce((total, width) => total + Number(width || 0), 0)}`}</span>
                </AccordionTrigger>
                <AccordionContent>
                  {data.header.some((rec) => Object.keys(rec).length > 0) ? (
                    <ScrollArea>
                      <ScrollAreaViewport className="max-h-[400px]">
                        {Object.keys(data.header[0]).map((fieldName) => (
                          <FormField
                            control={form.control}
                            name={`header.${fieldName}`}
                            key={`header${fieldName}`}
                            render={({ field }) => (
                              <FormItem className="pr-3 pl-1 pb-1">
                                <Label>{fieldName}</Label>
                                <FormControl>
                                  <Input {...field} type="number" min={0} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        ))}
                      </ScrollAreaViewport>
                    </ScrollArea>
                  ) : (
                    <div className="text-xs text-muted-foreground text-center">
                      No fields found.
                    </div>
                  )}
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="detail">
                <AccordionTrigger className="flex text-xs font-normal text-muted-foreground gap-x-2">
                  Detail Record
                  <span className="ml-auto">{`${Object.values(detailValues).reduce((total, width) => total + Number(width || 0), 0)}`}</span>
                </AccordionTrigger>
                <AccordionContent>
                  {data.detail.some((rec) => Object.keys(rec).length > 0) ? (
                    <ScrollArea>
                      <ScrollAreaViewport className="max-h-[400px]">
                        {Object.keys(data.detail[0]).map((fieldName) => (
                          <FormField
                            control={form.control}
                            name={`detail.${fieldName}`}
                            key={`detail${fieldName}`}
                            render={({ field }) => (
                              <FormItem className="pr-3 pl-1 pb-1">
                                <Label>{fieldName}</Label>
                                <FormControl>
                                  <Input {...field} type="number" min={0} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        ))}
                      </ScrollAreaViewport>
                    </ScrollArea>
                  ) : (
                    <div className="text-xs text-muted-foreground text-center">
                      No fields found.
                    </div>
                  )}
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="trailer">
                <AccordionTrigger className="flex text-xs font-normal text-muted-foreground gap-x-2">
                  Trailer Record
                  <span className="ml-auto">{`${Object.values(trailerValues).reduce((total, width) => total + Number(width || 0), 0)}`}</span>
                </AccordionTrigger>
                <AccordionContent>
                  {data.trailer.some((rec) => Object.keys(rec).length > 0) ? (
                    <ScrollArea>
                      <ScrollAreaViewport className="max-h-[400px]">
                        {Object.keys(data.trailer[0]).map((fieldName) => (
                          <FormField
                            control={form.control}
                            name={`trailer.${fieldName}`}
                            key={`trailer${fieldName}`}
                            render={({ field }) => (
                              <FormItem className="pr-3 pl-1 pb-1">
                                <Label>{fieldName}</Label>
                                <FormControl>
                                  <Input {...field} type="number" min={0} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        ))}
                      </ScrollAreaViewport>
                    </ScrollArea>
                  ) : (
                    <div className="text-xs text-muted-foreground text-center">
                      No fields found.
                    </div>
                  )}
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
