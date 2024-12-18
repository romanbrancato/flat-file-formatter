import { useFieldArray, useFormContext } from "react-hook-form";
import { ScrollArea, ScrollAreaViewport } from "@/components/ui/scroll-area";
import {
  Cross2Icon,
  Pencil2Icon,
  PlusCircledIcon,
} from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { useContext, useMemo, useState } from "react";
import { MultiSelect } from "@/components/ui/multi-select";
import { ParserContext } from "@/context/parser-context";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { tokenize } from "@/lib/utils";
import path from "node:path";
import { SelectOrdering } from "@/components/select-ordering";
import { FloatingLabelInput } from "@/components/ui/floating-label-input";

export function FormGroups() {
  const { data } = useContext(ParserContext);
  const { control } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    name: `groups`,
    control: control,
  });
  const { params } = useContext(ParserContext);
  const [open, setOpen] = useState(false);

  const tokens = useMemo(() => {
    return params?.file ? tokenize(path.parse(params.file.name).name) : [];
  }, [params?.file]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="w-full border-dashed">
          <Pencil2Icon className="mr-2" />
          Configure Output
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[800px] sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Configure Output</DialogTitle>
          <DialogDescription className="flex flex-row items-center justify-between">
            Each group will be written to a separate file.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-wrap gap-x-2 gap-y-1 whitespace-nowrap font-mono">
          {tokens.map((token, index) => (
            <Badge key={index} className="hover:bg-primary">
              {index}: {token}
            </Badge>
          ))}
        </div>
        <div className="space-y-1">
          <ScrollArea>
            <ScrollAreaViewport className="max-h-[400px]">
              {fields.map((field, index) => (
                <div className="mr-4 space-y-1" key={field.id}>
                  <div className="flex flex-row items-center">
                    <FormField
                      control={control}
                      name={`groups.${index}.name`}
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormControl>
                            <FloatingLabelInput
                              defaultValue={field.value}
                              label="Group Name"
                              onBlur={(e) => field.onChange(e)}
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
                  <FormField
                    control={control}
                    name={`groups.${index}.tags`}
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
                  <FormField
                    control={control}
                    name={`groups.${index}.ordering`}
                    defaultValue={"in order"}
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormControl>
                          <SelectOrdering
                            selectedOrdering={field.value}
                            onOrderingSelect={(ordering) =>
                              field.onChange(ordering)
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
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
      </DialogContent>
    </Dialog>
  );
}
