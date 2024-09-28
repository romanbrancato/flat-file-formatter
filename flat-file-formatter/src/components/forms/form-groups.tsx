import { useFieldArray, useFormContext } from "react-hook-form";
import { ScrollArea, ScrollAreaViewport } from "@/components/ui/scroll-area";
import { CaretSortIcon, PlusCircledIcon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { SelectTag } from "@/components/select-tag";
import { useState } from "react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

function GroupCollapsible({ fieldIndex }: { fieldIndex: number }) {
  const [isOpen, setIsOpen] = useState(false);
  const { control } = useFormContext();
  const { fields, append } = useFieldArray({
    name: `groups.tags.${fieldIndex}`,
    control: control,
  });

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="space-y-1">
      <div className="flex w-full items-center justify-between gap-x-1">
        <FormField
          control={control}
          name={`groups.${fieldIndex}.name`}
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormControl>
                <Input placeholder="Group Name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <CollapsibleTrigger asChild>
          <Button variant="ghost" size="icon">
            <CaretSortIcon />
            <span className="sr-only">Toggle</span>
          </Button>
        </CollapsibleTrigger>
      </div>
      <CollapsibleContent className="space-y-1">
        <ScrollArea>
          <ScrollAreaViewport className="max-h-[200px]">
            {fields.map((field, index) => (
              <FormField
                key={field.id}
                control={control}
                name={`groups.${fieldIndex}.tags.${index}.tag`}
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
          </ScrollAreaViewport>
        </ScrollArea>
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
      </CollapsibleContent>
    </Collapsible>
  );
}

export function FormGroups() {
  const { control } = useFormContext();
  const { fields, append } = useFieldArray({
    name: `groups`,
    control: control,
  });

  return (
    <div className="space-y-1">
      <ScrollArea>
        <ScrollAreaViewport className="max-h-[400px]">
          {fields.map((field, index) => (
            <GroupCollapsible key={field.id} fieldIndex={index} />
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
    </div>
  );
}
