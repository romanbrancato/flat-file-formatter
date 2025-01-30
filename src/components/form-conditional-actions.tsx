import { useFieldArray, useFormContext, useWatch } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { SelectField } from "@/components/select-field";
import { Field } from "@/types/schemas";
import { FormDuplicateRow } from "@/components/form-duplicate-row";
import { ScrollArea, ScrollAreaViewport } from "@/components/ui/scroll-area";
import { Cross2Icon, PlusCircledIcon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";
import { FloatingLabelInput } from "@/components/ui/floating-label-input";
import { Selector } from "@/components/selector";

const ActionFields = ({ actionType }: { actionType: "True" | "False" }) => {
  const { control } = useFormContext();

  const { fields, append, remove } = useFieldArray({
    name: `action${actionType}.values`,
    control: control,
  });

  const action = useWatch({
    control: control,
    name: `action${actionType}.action`,
  });

  const tag = useWatch({
    control: control,
    name: "tag",
  });

  return (
    <>
      <FormField
        control={control}
        name={`action${actionType}.action`}
        defaultValue={""}
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <Selector
                label={`action on ${actionType}`}
                selected={field.value}
                options={[
                  { label: "set value", value: "set value" },
                  { label: "separate", value: "separate" },
                  { label: "duplicate", value: "duplicate" },
                  { label: "nothing", value: "nothing" },
                ]}
                onSelect={(action) => {
                  field.onChange(action);
                }}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      {action === "set value" && (
        <>
          <ScrollArea>
            <ScrollAreaViewport className="max-h-[100px]">
              {fields.map((field, index) => (
                <div
                  key={field.id}
                  className="mr-4 flex flex-row items-center gap-x-2"
                >
                  <FormField
                    control={control}
                    name={`action${actionType}.values.${index}.field`}
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
                    name={`action${actionType}.values.${index}.value`}
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
        </>
      )}
      {action === "separate" && (
        <FormField
          control={control}
          name={`action${actionType}.tag`}
          defaultValue={""}
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <FloatingLabelInput label="Tag" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      )}
      {action === "duplicate" && <FormDuplicateRow actionType={actionType} />}
    </>
  );
};

export function FormConditionalActions() {
  return (
    <>
      <ActionFields actionType="True" />
      <ActionFields actionType="False" />
    </>
  );
}
