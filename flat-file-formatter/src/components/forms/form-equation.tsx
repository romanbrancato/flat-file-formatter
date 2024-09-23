import { useFieldArray, useFormContext } from "react-hook-form";
import { ScrollArea, ScrollAreaViewport } from "@/components/ui/scroll-area";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { SelectDirection } from "@/components/select-direction";
import { SelectOperator } from "@/components/select-operator";
import { SelectField } from "@/components/select-field";
import { Field } from "@/types/schemas";
import { Cross2Icon, PlusCircledIcon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";

export function FormEquation() {
  const { control } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    name: `equation`,
    control: control,
  });
  return (
    <div className="space-y-1">
      <FormField
        control={control}
        name="direction"
        defaultValue={"row"}
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <SelectDirection
                selectedDirection={field.value as "row" | "column"}
                onDirectionSelect={(direction) => {
                  field.onChange(direction);
                }}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <ScrollArea>
        <ScrollAreaViewport className="max-h-[400px]">
          {fields.map((field, index) => (
            <div
              key={field.id}
              className="mr-4 flex flex-row items-center gap-x-2"
            >
              <FormField
                control={control}
                name={`equation.${index}.operator`}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <SelectOperator
                        selectedOperator={field.value as "+" | "-"}
                        onOperatorSelect={(operator) => {
                          field.onChange(operator);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name={`equation.${index}.field`}
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormControl>
                      <SelectField
                        selectedField={field.value as Field}
                        onFieldSelect={(selectedField) => {
                          field.onChange(selectedField);
                        }}
                      />
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
            operator: "+",
            field: { name: "", flag: "" },
          });
        }}
      >
        <PlusCircledIcon className="mr-2" />
        Add Constant
      </Button>
      <div className="flex flex-row items-center justify-between gap-x-2">
        <FormField
          control={control}
          name="output"
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormControl>
                <SelectField
                  selectedField={field.value as Field}
                  onFieldSelect={(selectedField) => {
                    field.onChange(selectedField);
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}
