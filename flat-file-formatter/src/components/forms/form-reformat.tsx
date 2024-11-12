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
import { CheckboxOverpunch } from "@/components/checkbox-overpunch";
import { FloatingLabelInput } from "@/components/ui/floating-label-input";

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
                name={`fields.${index}`}
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
          });
        }}
      >
        <PlusCircledIcon className="mr-2" />
        Additional Field
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
      <FormField
        control={control}
        name={`reformat.pattern`}
        defaultValue={""}
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <FloatingLabelInput label="Pattern" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      {type === "number" && (
        <FormField
          control={control}
          name={`reformat.overpunch`}
          defaultValue={false}
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <CheckboxOverpunch
                  checked={field.value}
                  onCheckedChange={field.onChange}
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
