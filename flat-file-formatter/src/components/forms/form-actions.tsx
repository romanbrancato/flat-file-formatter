import { useFormContext, useWatch } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { SelectAction } from "@/components/select-action";
import { SelectField } from "@/components/select-field";
import { Field } from "@/types/schemas";
import { Input } from "@/components/ui/input";
import { FormDuplicate } from "@/components/forms/form-duplicate";

const ActionFields = ({ actionType }: { actionType: "True" | "False" }) => {
  const { control } = useFormContext();
  const action = useWatch({
    control: control,
    name: `action${actionType}.action`,
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
              <SelectAction
                label={`Action if ${actionType}`}
                selectedAction={field.value}
                onActionSelect={(action) => {
                  field.onChange(action);
                }}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      {action === "setValue" && (
        <>
          <FormField
            control={control}
            name={`action${actionType}.field`}
            defaultValue={{ name: "", type: "" }}
            render={({ field }) => (
              <FormItem>
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
          <FormField
            control={control}
            name={`action${actionType}.value`}
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input placeholder="Value" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
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
                <Input placeholder="Tag" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      )}
      {action === "duplicate" && <FormDuplicate actionType={actionType} />}
    </>
  );
};

export function FormActions() {
  return (
    <>
      <ActionFields actionType="True" />
      <ActionFields actionType="False" />
    </>
  );
}
