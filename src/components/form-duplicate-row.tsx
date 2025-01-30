import { useFieldArray, useFormContext, useWatch } from "react-hook-form";
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
import { SelectField } from "@/components/select-field";
import { Field } from "@/types/schemas";
import { Cross2Icon, PlusCircledIcon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";
import { FloatingLabelInput } from "@/components/ui/floating-label-input";

function AccordionItemComponent({
  row,
  actionType,
}: {
  row: "Original" | "Duplicate";
  actionType: string;
}) {
  const { control } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    name: `action${actionType}.row${row}`,
    control: control,
  });

  const tag = useWatch({
    control: control,
    name: "tag",
  });

  return (
    <AccordionItem value={row}>
      <AccordionTrigger className="flex text-xs font-normal text-muted-foreground">
        {row === "Original" ? "Original Row" : "Duplicate Row"}
      </AccordionTrigger>
      <AccordionContent className="space-y-1">
        <ScrollArea>
          <ScrollAreaViewport className="max-h-[100px]">
            {fields.map((field, index) => (
              <div
                key={field.id}
                className="mr-4 flex flex-row items-center gap-x-2"
              >
                <FormField
                  control={control}
                  name={`action${actionType}.row${row}.${index}.field`}
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormControl>
                        <SelectField
                          selectedField={field.value as Field}
                          filter={tag}
                          onFieldSelect={(selectedField) => {
                            field.onChange(selectedField);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={control}
                  name={`action${actionType}.row${row}.${index}.value`}
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormControl>
                        <FloatingLabelInput label="Value" {...field} />
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
            append({
              field: { name: "", tag: "" },
              value: "",
            });
          }}
        >
          <PlusCircledIcon className="mr-2" />
          Additional Value
        </Button>
      </AccordionContent>
    </AccordionItem>
  );
}

export function FormDuplicateRow({
  actionType,
}: {
  actionType: "True" | "False";
}) {
  return (
    <Accordion type="single" collapsible>
      <AccordionItemComponent row="Original" actionType={actionType} />
      <AccordionItemComponent row="Duplicate" actionType={actionType} />
    </Accordion>
  );
}
