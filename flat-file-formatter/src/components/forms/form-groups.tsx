import { useFieldArray, useFormContext } from "react-hook-form";
import { ScrollArea, ScrollAreaViewport } from "@/components/ui/scroll-area";
import { PlusCircledIcon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { SelectTag } from "@/components/select-tag";

function Grouping({ fieldIndex }: { fieldIndex: number }) {
  const { control } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    name: `groups[${fieldIndex}].tags`,
    control: control,
  });

  return (
    <div className="flex flex-row">
      <FormField
        control={control}
        name={`output.groups[${fieldIndex}].name`}
        render={({ field }) => (
          <FormItem className="flex-1">
            <FormControl>
              <Input placeholder="Group Name" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <ScrollArea className="flex-1">
        <ScrollAreaViewport className="max-h-[100px]">
          {fields.map((field, index) => (
            <FormField
              key={field.id}
              control={control}
              name={`output.groups[${fieldIndex}].tags[${index}].tag`}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <SelectTag
                      label="Tag"
                      selectedTag={field.value}
                      onTagSelect={(tag: string) => {
                        field.onChange(tag);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          ))}
          <Button
            variant="outline"
            size="sm"
            className="w-full border-dashed"
            onClick={(event) => {
              event.preventDefault();
              append({ tag: "" });
            }}
          >
            <PlusCircledIcon className="mr-2" />
            Add Tag
          </Button>
        </ScrollAreaViewport>
      </ScrollArea>
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
    <>
      <ScrollArea>
        <ScrollAreaViewport className="max-h-[400px]">
          {fields.map((field, index) => (
            <Grouping key={field.id} fieldIndex={index} />
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
        Additional Group
      </Button>
    </>
  );
}
