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
import { useFormContext, useWatch } from "react-hook-form";

export function FormReformat() {
  const { control } = useFormContext();
  const type = useWatch({
    control: control,
    name: "details.type",
  });
  return (
    <div className="space-y-1">
      <FormField
        control={control}
        name={`details.type`}
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
        name={`field`}
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
      {type === "date" && (
        <FormField
          control={control}
          name={`details.pattern`}
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
    </div>
  );
}
