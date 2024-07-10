import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React, { useEffect, useState } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { z } from "zod";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Cross2Icon,
  Pencil2Icon,
  PlusCircledIcon,
  Share2Icon,
} from "@radix-ui/react-icons";
import { Dropzone } from "@/components/dropzone";
import { toast } from "sonner";
import { SelectImportFormat } from "@/components/select-import-format";
import { MultiFormatConfig } from "@/lib/parser-functions";
import { ScrollArea, ScrollAreaViewport } from "@/components/ui/scroll-area";

export const configSchema = z.discriminatedUnion("format", [
  z.object({
    format: z.literal("delimited"),
  }),
  z.object({
    format: z.literal("fixed"),
    fields: z.array(
      z.object({
        property: z.string(),
        width: z.coerce.number(),
      }),
    ),
  }),
]);

export function ButtonParserConfig({
  setConfig,
}: {
  setConfig: React.Dispatch<React.SetStateAction<MultiFormatConfig>>;
}) {
  const [open, setOpen] = useState(false);
  const [files, setFiles] = useState<File[]>([]);

  const form = useForm<z.infer<typeof configSchema>>({
    resolver: zodResolver(configSchema),
    defaultValues: {
      format: "delimited",
    },
  });

  const { fields, append, remove } = useFieldArray({
    name: "fields",
    control: form.control,
  });

  function onSubmit(values: MultiFormatConfig) {
    setConfig(values);
    setOpen(false);
  }

  const exportConfig = () => {};

  useEffect(() => {
    if (!files.length) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const obj = JSON.parse(event.target?.result as string);
        const config = configSchema.parse(obj);

        if (config.format === "delimited") {
          form.setValue("format", config.format);
        } else if (config.format === "fixed") {
          form.setValue("format", config.format);
          config.fields.forEach((field) => {
            append(field);
          });
        }
      } catch (error) {
        toast.error("Invalid Config", {
          description: "The selected file is not a valid config.",
        });
      }
    };
    reader.readAsText(files[files.length - 1]);
  }, [files]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="w-full border-dashed">
          <Pencil2Icon className="mr-2" />
          Configure Parser
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[800px]">
        <DialogHeader>
          <DialogTitle>Parser Config</DialogTitle>
          <DialogDescription className="flex flex-row items-center gap-x-1">
            Configure the parser.
            <Button
              className="ml-auto w-1/5"
              onClick={() => form.handleSubmit(onSubmit)()}
            >
              Save
            </Button>
            <Button size="icon" onClick={() => exportConfig()}>
              <Share2Icon />
            </Button>
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name={"format"}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <SelectImportFormat
                      defaultValue={form.getValues().format}
                      onFormatSelect={(format) =>
                        form.setValue("format", format, {
                          shouldValidate: true,
                        })
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {form.getValues().format === "fixed" && (
              <>
                <div className="relative my-4">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">
                      WIDTHS
                    </span>
                  </div>
                </div>
                <ScrollArea>
                  <ScrollAreaViewport className="max-h-[400px]">
                    {fields.map((field, index) => (
                      <div
                        key={field.id}
                        className="grid grid-cols-7 mb-2 gap-x-1 items-center p-1"
                      >
                        <FormField
                          control={form.control}
                          name={`fields.${index}.property`}
                          render={({ field }) => (
                            <FormItem className="col-span-5">
                              <FormControl>
                                <Input {...field} placeholder="Field" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name={`fields.${index}.width`}
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Input
                                  {...field}
                                  placeholder="Width"
                                  type="number"
                                  min={0}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <Cross2Icon
                          className="hover:text-destructive mx-auto opacity-70"
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
                    append({ property: "", width: 0 });
                  }}
                >
                  <PlusCircledIcon className="mr-2" />
                  Add Field
                </Button>
              </>
            )}
          </form>
        </Form>
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              OR UPLOAD CONFIG
            </span>
          </div>
        </div>
        <Dropzone onChange={setFiles} fileExtension=".json" />
      </DialogContent>
    </Dialog>
  );
}
