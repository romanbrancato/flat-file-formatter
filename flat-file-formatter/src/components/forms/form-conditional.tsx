import { ScrollArea, ScrollAreaViewport } from "@/components/ui/scroll-area";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { SelectStatement } from "@/components/select-statement";
import { SelectField } from "@/components/select-field";
import { Field } from "@/types/schemas";
import { SelectComparison } from "@/components/select-comparison";
import { Input } from "@/components/ui/input";
import { Cross2Icon, PlusCircledIcon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";
import { FormActions } from "@/components/forms/form-actions";
import { useFieldArray, useFormContext, useWatch } from "react-hook-form";

export function FormConditional() {
  const { control } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    name: `conditions`,
    control: control,
  });

  const tag = useWatch({
    control: control,
    name: "tag",
  });

  return (
    <div className="space-y-1">
      <ScrollArea>
        <ScrollAreaViewport className="max-h-[400px]">
          {fields.map((field, index) => (
            <div
              key={field.id}
              className="mr-4 flex flex-row items-center gap-x-2"
            >
              <FormField
                control={control}
                name={`conditions.${index}.statement`}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <SelectStatement
                        selectedStatement={field.value as "if" | "if not"}
                        onStatementSelect={(statement) =>
                          field.onChange(statement)
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name={`conditions.${index}.field`}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <SelectField
                        selectedField={field.value as Field}
                        filter={[tag]}
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
                name={`conditions.${index}.comparison`}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <SelectComparison
                        selectedComparison={field.value as "<" | "=" | ">"}
                        onComparisonSelect={(comparison) => {
                          field.onChange(comparison);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name={`conditions.${index}.value`}
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
                className="ml-auto flex-shrink-0 opacity-70 hover:text-destructive"
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
            statement: "if",
            field: { name: "", tag: "" },
            comparison: "=",
            value: "",
          });
        }}
      >
        <PlusCircledIcon className="mr-2" />
        Additional Condition
      </Button>
      <FormActions />
    </div>
  );
}
