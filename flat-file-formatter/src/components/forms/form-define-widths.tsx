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
import { useContext, useState } from "react";
import { SelectTag } from "@/components/select-tag";
import { Separator } from "@/components/ui/separator";

function AccordionItemComponent({
  tag,
  fields,
}: {
  tag: string;
  fields: string[];
}) {
  const { setValue, control } = useFormContext();

  const [selectedTag, setSelectedTag] = useState<string | undefined>(undefined);

  const widths = useWatch({
    control,
    name: "widths",
    defaultValue: {},
  });

  const copyWidths = (selectedTag: string) => {
    fields.forEach((field) => {
      setValue(`widths.${tag}.${field}`, widths[selectedTag][field] || 0);
    });
    setSelectedTag(undefined);
  };

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
        <Separator />
        <div className="mt-2">
          <SelectTag
            label={"Copy"}
            selectedTag={selectedTag}
            onTagSelect={(tag) => copyWidths(tag)}
          />
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}

export function FormDefineWidths() {
  const { data } = useContext(ParserContext);
  return (
    <Accordion type="single" collapsible>
      {Object.entries(data.records)
        .filter(([, records]) => records.fields.length)
        .map(([tag, records]) => (
          <AccordionItemComponent tag={tag} fields={records.fields} key={tag} />
        ))}
    </Accordion>
  );
}
