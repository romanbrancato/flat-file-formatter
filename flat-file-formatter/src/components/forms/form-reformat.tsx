import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { SelectType } from "@/components/select-type";
import { Field } from "@/types/schemas";
import { useFormContext, useWatch } from "react-hook-form";
import { CheckboxOverpunch } from "@/components/checkbox-overpunch";
import { FloatingLabelInput } from "@/components/ui/floating-label-input";
import { SelectFields } from "@/components/select-fields";
import { useContext } from "react";
import { ParserContext } from "@/context/parser-context";

export function FormReformat() {
  const { control } = useFormContext();
  const { data } = useContext(ParserContext);

  const type = useWatch({
    control: control,
    name: "reformat.type",
  });

  const tag = useWatch({
    control: control,
    name: "tag",
  });

  const options = Object.entries(data.records)
    .filter(([recordTag]) => recordTag === tag)
    .flatMap(([, records]) => records.fields.map((name) => ({ tag, name })));

  return (
    <div className="space-y-1">
      <FormField
        control={control}
        name={`fields`}
        render={({ field }) => (
          <FormItem className="flex-1">
            <FormControl>
              <SelectFields
                label="Select Fields"
                options={options}
                defaultValues={field.value as Field[]}
                onValueChange={(fields) => field.onChange(fields)}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
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
