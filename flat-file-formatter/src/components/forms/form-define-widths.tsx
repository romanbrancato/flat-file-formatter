import { useFormContext, useWatch } from "react-hook-form";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ScrollArea, ScrollAreaViewport } from "@/components/ui/scroll-area";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ParserContext } from "@/context/parser-context";
import { useContext } from "react";

export function FormDefineWidths() {
  const { data } = useContext(ParserContext);
  const { control } = useFormContext();
  const headerValues = useWatch({ control: control, name: "widths.header" });
  const detailValues = useWatch({ control: control, name: "widths.detail" });
  const trailerValues = useWatch({ control: control, name: "widths.trailer" });

  const records = {
    header: {
      values: headerValues,
      data: data.records.header,
      label: "Header Record",
    },
    detail: {
      values: detailValues,
      data: data.records.detail,
      label: "Detail Record",
    },
    trailer: {
      values: trailerValues,
      data: data.records.trailer,
      label: "Trailer Record",
    },
  };

  return (
    <Accordion type="single" collapsible>
      {Object.entries(records).map(([key, { values, data, label }]) => (
        <AccordionItem value={key} key={key}>
          <AccordionTrigger className="flex text-xs font-normal text-muted-foreground gap-x-2">
            {label}
            <span className="ml-auto">
              {`${Object.values(values).reduce((total: number, width) => total + Number(width || 0), 0)}`}
            </span>
          </AccordionTrigger>
          <AccordionContent>
            {data.some((rec) => Object.keys(rec).length > 0) ? (
              <ScrollArea>
                <ScrollAreaViewport className="max-h-[400px]">
                  {Object.keys(data[0]).map((fieldName) => (
                    <FormField
                      control={control}
                      name={`widths.${key}.${fieldName}`}
                      defaultValue={20}
                      key={`${key}${fieldName}`}
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
      ))}
    </Accordion>
  );
}
