import { useFieldArray, useFormContext } from "react-hook-form";
import { ScrollArea, ScrollAreaViewport } from "@/components/ui/scroll-area";
import { Cross2Icon, PlusCircledIcon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useContext } from "react";
import { MultiSelect } from "@/components/ui/multi-select";
import { ParserContext } from "@/context/parser-context";

function GroupCollapsible({ fieldIndex }: { fieldIndex: number }) {
  const { data } = useContext(ParserContext);
  const { control } = useFormContext();

  return (
    <div className="flex-1 space-y-1">
      <FormField
        control={control}
        name={`groups.${fieldIndex}.name`}
        render={({ field }) => (
          <FormItem className="flex-1">
            <FormControl>
              <Input
                defaultValue={field.value}
                placeholder="Group Name"
                onBlur={(e) => field.onChange(e)}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name={`groups.${fieldIndex}.tags`}
        render={({ field }) => (
          <FormItem className="flex-1">
            <FormControl>
              <MultiSelect
                options={Object.keys(data.records)}
                defaultValue={field.value}
                placeholder="Select Tags"
                onValueChange={(tags) => field.onChange(tags)}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}

export function FormGroups() {
  const { control } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    name: `groups`,
    control: control,
  });

  return (
    <div className="space-y-1">
      <ScrollArea>
        <ScrollAreaViewport className="max-h-[400px]">
          {fields.map((field, index) => (
            <div
              className="mr-4 flex flex-row items-center space-x-2"
              key={field.id}
            >
              <GroupCollapsible fieldIndex={index} />
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
          append({ name: "", tags: [] });
        }}
      >
        <PlusCircledIcon className="mr-2" />
        Add Group
      </Button>
    </div>
  );
}
