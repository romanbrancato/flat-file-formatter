import { useContext, useState } from "react";
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
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { useFormContext, useWatch } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { ScrollArea, ScrollAreaViewport } from "@/components/ui/scroll-area";
import { ParserContext } from "@/context/parser-context";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export function ButtonDefineWidths() {
  const { data } = useContext(ParserContext);
  const { control } = useFormContext();

  const [open, setOpen] = useState(false);

  const headerValues = useWatch({ control: control, name: "widths.header" });
  const detailValues = useWatch({ control: control, name: "widths.detail" });
  const trailerValues = useWatch({ control: control, name: "widths.trailer" });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="w-full border-dashed">
          <Pencil2Icon className="mr-2" />
          Define Widths
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[800px]">
        <DialogHeader>
          <DialogTitle>Define Widths</DialogTitle>
          <DialogDescription className="flex flex-row justify-between items-center">
            Define the widths of each field in characters.
          </DialogDescription>
        </DialogHeader>
        <Accordion type="single" collapsible>
          <AccordionItem value="header">
            <AccordionTrigger className="flex text-xs font-normal text-muted-foreground gap-x-2">
              Header Record
              <span className="ml-auto">{`${Object.values(headerValues).reduce((total: number, width) => total + Number(width || 0), 0)}`}</span>
            </AccordionTrigger>
            <AccordionContent>
              {data.header.some((rec) => Object.keys(rec).length > 0) ? (
                <ScrollArea>
                  <ScrollAreaViewport className="max-h-[400px]">
                    {Object.keys(data.header[0]).map((fieldName) => (
                      <FormField
                        control={control}
                        name={`widths.header.${fieldName}`}
                        key={`header${fieldName}`}
                        render={({ field }) => (
                          <FormItem className="mt-2 mr-3">
                            <FormControl>
                              <div className="relative">
                                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none font-normal text-muted-foreground">
                                  {fieldName}
                                </span>
                                <Input
                                  className="text-right"
                                  {...field}
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
              <span className="ml-auto">{`${Object.values(detailValues).reduce((total: number, width) => total + Number(width || 0), 0)}`}</span>
            </AccordionTrigger>
            <AccordionContent>
              {data.detail.some((rec) => Object.keys(rec).length > 0) ? (
                <ScrollArea>
                  <ScrollAreaViewport className="max-h-[400px]">
                    {Object.keys(data.detail[0]).map((fieldName) => (
                      <FormField
                        control={control}
                        name={`widths.detail.${fieldName}`}
                        key={`detail${fieldName}`}
                        render={({ field }) => (
                          <FormItem className="mt-2 mr-3">
                            <FormControl>
                              <div className="relative">
                                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none font-normal text-muted-foreground text-xs">
                                  {fieldName}
                                </span>
                                <Input
                                  className="text-right"
                                  {...field}
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
              <span className="ml-auto">{`${Object.values(trailerValues).reduce((total: number, width) => total + Number(width || 0), 0)}`}</span>
            </AccordionTrigger>
            <AccordionContent>
              {data.trailer.some((rec) => Object.keys(rec).length > 0) ? (
                <ScrollArea>
                  <ScrollAreaViewport className="max-h-[400px]">
                    {Object.keys(data.trailer[0]).map((fieldName) => (
                      <FormField
                        control={control}
                        name={`widths.trailer.${fieldName}`}
                        key={`trailer${fieldName}`}
                        render={({ field }) => (
                          <FormItem className="mt-2 mr-3">
                            <FormControl>
                              <div className="relative">
                                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none font-normal text-muted-foreground">
                                  {fieldName}
                                </span>
                                <Input
                                  className="text-right"
                                  {...field}
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
      </DialogContent>
    </Dialog>
  );
}
