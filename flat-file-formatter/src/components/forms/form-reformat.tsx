import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { SelectType } from "@/components/select-type";
import { SelectField } from "@/components/select-field";
import { Field } from "@/types/schemas";
import { Input } from "@/components/ui/input";
import { useFieldArray, useFormContext, useWatch } from "react-hook-form";
import { ScrollArea, ScrollAreaViewport } from "@/components/ui/scroll-area";
import { Cross2Icon, PlusCircledIcon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";
import { SelectFrom } from "@/components/select-from";

export function FormReformat() {
  const { control } = useFormContext();

  const { fields, append, remove } = useFieldArray({
    name: `fields`,
    control: control,
  });

  const type = useWatch({
    control: control,
    name: "reformat.type",
  });
  return (
    <div className="space-y-1">
      <ScrollArea>
        <ScrollAreaViewport className="max-h-[400px]">
          {fields.map((field, index) => (
            <div
              key={field.id}
              className="flex flex-row gap-x-2 mt-1 items-center mr-4"
            >
              <FormField
                control={control}
                name={`fields.${index}`}
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
                className="hover:text-destructive ml-auto opacity-70"
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
          });
        }}
      >
        <PlusCircledIcon className="mr-2" />
        Add Field
      </Button>
      <FormField
        control={control}
        name={`reformat.type`}
        render={({ field }) => (
          <FormItem className="flex-1">
            <FormControl>
              <SelectType
                selectedType={field.value}
                onTypeSelect={(type) => {
                  field.onChange(type);
                }}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      {type === "date" && (
        <FormField
          control={control}
          name={`reformat.pattern`}
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input placeholder="Pattern" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      )}
      {type === "number" && (
        <FormField
          control={control}
          name={`reformat.from`}
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <SelectFrom
                  selectedFrom={field.value}
                  onFromSelect={(from) => field.onChange(from)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      )}
    </div>
  );
}
