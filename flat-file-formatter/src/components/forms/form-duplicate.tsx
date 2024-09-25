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
import { Input } from "@/components/ui/input";
import { SelectField } from "@/components/select-field";
import { Field } from "@/types/schemas";
import { Cross2Icon, PlusCircledIcon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";

function AccordionItemComponent({
  record,
  actionType,
}: {
  record: "first" | "second";
  actionType: string;
}) {
  const { control } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    name: `action${actionType}.${record}Record`,
    control: control,
  });

  const tag = useWatch({
    control: control,
    name: "tag",
  });

  return (
    <AccordionItem value={record}>
      <AccordionTrigger className="flex text-xs font-normal text-muted-foreground">
        {record === "first" ? "First Record" : "Second Record"}
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
                  name={`action${actionType}.${record}Record.${index}.field`}
                  defaultValue={{ name: "", flag: "" }}
                  render={({ field }) => (
                    <FormItem>
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
                  name={`action${actionType}.${record}Record.${index}.value`}
                  defaultValue={""}
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormControl>
                        <Input placeholder="Value" {...field} />
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
              field: { name: "", flag: "" },
              value: "",
            });
          }}
        >
          <PlusCircledIcon className="mr-2" />
          Add Value Change
        </Button>
      </AccordionContent>
    </AccordionItem>
  );
}

export function FormDuplicate({
  actionType,
}: {
  actionType: "True" | "False";
}) {
  return (
    <Accordion type="single" collapsible>
      <AccordionItemComponent record="first" actionType={actionType} />
      <AccordionItemComponent record="second" actionType={actionType} />
    </Accordion>
  );
}
