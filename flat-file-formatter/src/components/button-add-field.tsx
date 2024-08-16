import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { PlusCircledIcon } from "@radix-ui/react-icons";
import { Input } from "@/components/ui/input";
import { useContext, useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { useForm, useWatch } from "react-hook-form";
import { PresetContext } from "@/context/preset-context";
import { ParserContext } from "@/context/parser-context";
import { SelectFlag } from "@/components/select-flag";
import { z } from "zod";
import { SelectField } from "@/components/select-field";
import { AddFieldSchema, FieldSchema } from "@/types/schemas";

const AddFieldWithPosSchema = AddFieldSchema.extend({
  after: FieldSchema.nullable(),
});

export type AddFieldWithPos = z.infer<typeof AddFieldWithPosSchema>;

export function ButtonAddField() {
  const { isReady, addField } = useContext(ParserContext);
  const { preset, setPreset } = useContext(PresetContext);
  const [open, setOpen] = useState(false);

  const form = useForm<AddFieldWithPos>({
    resolver: zodResolver(AddFieldWithPosSchema),
    defaultValues: {
      flag: "detail",
      name: "",
      value: "",
      after: null,
    },
  });

  const flagValue = useWatch({ control: form.control, name: "flag" });

  function onSubmit(values: AddFieldWithPos) {
    addField(values);

    const { after, ...noPos } = values;

    setPreset({
      ...preset,
      changes: {
        ...preset.changes,
        add: [...preset.changes.add, noPos],
      },
    });

    setOpen(false);
    form.reset();
  }

  useEffect(() => {
    form.setValue("after", null);
  }, [flagValue]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild className="flex-1">
        <Button
          variant="outline"
          size="sm"
          className="w-full border-dashed"
          disabled={!isReady}
        >
          <PlusCircledIcon className="mr-2" />
          Add Field
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[800px]">
        <DialogHeader>
          <DialogTitle>Add Field</DialogTitle>
          <DialogDescription>
            Define a field and what to populate it with.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-y-2"
          >
            <FormField
              control={form.control}
              name="flag"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <SelectFlag
                      label="Add To"
                      selectedFlag={field.value}
                      onFlagSelect={(flag: "header" | "detail" | "trailer") => {
                        form.setValue("flag", flag, {
                          shouldValidate: true,
                        });
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="value"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="Populate with..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="after"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <SelectField
                      selectedField={field.value}
                      label="Add After"
                      filter={flagValue}
                      onFieldSelect={(field) => {
                        form.setValue(`after`, field, {
                          shouldValidate: true,
                        });
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-1/3 ml-auto">
              Add
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
