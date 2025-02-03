import { useFieldArray, useForm } from "react-hook-form";
import { ScrollArea, ScrollAreaViewport } from "@/components/ui/scroll-area";
import { Cross2Icon, PlusCircledIcon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { useContext, useState } from "react";
import { MultiSelect } from "@/components/ui/multi-select";
import { DataProcessorContext } from "@/context/data-processor-context";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { download } from "@/lib/utils";
import { FloatingLabelInput } from "@/components/ui/floating-label-input";
import { PresetContext } from "@/context/preset-context";
import { Output, OutputSchema } from "@common/types/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { Selector } from "@/components/selector";
import { createFile } from "@common/lib/parser-fns";

export function DialogConfigureOutput({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data } = useContext(DataProcessorContext);
  const { preset, setPreset } = useContext(PresetContext);
  const { params } = useContext(DataProcessorContext);
  const [open, setOpen] = useState(false);

  const form = useForm<Output>({
    resolver: zodResolver(OutputSchema),
    defaultValues: { ...preset.output },
  });

  const { fields, append, remove } = useFieldArray({
    name: `groups`,
    control: form.control,
  });

  function onSubmit(values: Output) {
    setPreset({
      ...preset,
      output: values,
    });
    if (!params) return;
    const file = createFile(data, preset);
    if (!file) return;
    download(file);
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-h-[75%] max-w-[50%] overflow-auto">
        <DialogHeader>
          <DialogTitle>Output</DialogTitle>
          <DialogDescription className="flex flex-row items-center justify-between">
            Each defined group will be written to a separate file.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-y-1"
          >
            <ScrollArea>
              <ScrollAreaViewport className="max-h-[400px]">
                {fields.map((field, index) => (
                  <div
                    className="mr-4 flex border p-2 hover:border-muted-foreground"
                    key={field.id}
                  >
                    <div className="flex-1 flex-row space-y-1">
                      <FormField
                        control={form.control}
                        name={`groups.${index}.name`}
                        render={({ field }) => (
                          <FormItem>
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
                      <FormField
                        control={form.control}
                        name={`groups.${index}.tags`}
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <MultiSelect
                                options={Object.keys(data)}
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
                        control={form.control}
                        name={`groups.${index}.ordering`}
                        defaultValue={"in order"}
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Selector
                                label="ordering"
                                selected={field.value}
                                options={[
                                  { label: "in order", value: "in order" },
                                  {
                                    label: "round robin",
                                    value: "round robin",
                                  },
                                ]}
                                onSelect={(ordering) => {
                                  field.onChange(ordering);
                                }}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <Cross2Icon
                      className="ml-auto opacity-70 hover:text-destructive"
                      onClick={() => remove(index)}
                    />
                  </div>
                ))}
              </ScrollAreaViewport>
            </ScrollArea>
            <div className="flex flex-row content-center justify-between">
              <Button
                variant="outline"
                size="sm"
                className="w-1/3 border-dashed"
                onClick={(event) => {
                  event.preventDefault();
                  append({ name: "", tags: [], ordering: "in order" });
                }}
              >
                <PlusCircledIcon className="mr-2" />
                Add Group
              </Button>
              <Button type="submit" className="w-1/3">
                Download
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
