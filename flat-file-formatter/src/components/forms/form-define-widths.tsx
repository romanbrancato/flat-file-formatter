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

function AccordionItemComponent({
  tag,
  fields,
}: {
  tag: string;
  fields: string[];
}) {
  const { control } = useFormContext();

  return (
    <AccordionItem value={tag}>
      <AccordionTrigger className="flex gap-x-2 text-xs font-normal text-muted-foreground">
        {tag}
        <span className="ml-auto">
          {Object.values(
            useWatch({ control, name: `widths.${tag}`, defaultValue: 0 }),
          ).reduce((total: number, width) => total + Number(width || 0), 0)}
        </span>
      </AccordionTrigger>
      <AccordionContent className="space-y-1">
        <ScrollArea>
          <ScrollAreaViewport className="max-h-[400px]">
            {fields.map((fieldName) => (
              <FormField
                control={control}
                name={`widths.${tag}.${fieldName}`}
                key={`${tag}${fieldName}`}
                defaultValue={0}
                render={({ field }) => (
                  <FormItem className="mr-3 mt-2">
                    <FormControl>
                      <div className="relative">
                        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 transform text-xs font-normal text-muted-foreground">
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
      </AccordionContent>
    </AccordionItem>
  );
}

export function FormDefineWidths() {
  const { data } = useContext(ParserContext);
  return (
    <Accordion type="single" collapsible>
      {Object.entries(data.records)
        .filter(
          ([, records]) => records.length && Object.keys(records[0]).length,
        )
        .map(([tag, records]) => (
          <AccordionItemComponent
            tag={tag}
            fields={Object.keys(records[0])}
            key={tag}
          />
        ))}
    </Accordion>
  );
}
