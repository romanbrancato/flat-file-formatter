import { useContext, useState } from "react";
import { DataContext } from "@/context/data-context";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Pencil2Icon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Label } from "@/components/ui/label";
import { tokenize } from "@/lib/utils";
import { PresetContext } from "@/context/preset-context";

const FileNameEditSchema = z.object({
  schema: z.string(),
});

export function DefineSchemaButton() {
  const { data, name, applySchema } = useContext(DataContext);
  const { setSchema } = useContext(PresetContext);
  const [open, setOpen] = useState(false);
  const tokenized = tokenize(name);

  const form = useForm({
    resolver: zodResolver(FileNameEditSchema),
    defaultValues: {
      schema: "",
    },
  });

  const onSubmit: SubmitHandler<FieldValues> = (values) => {
    setSchema(values.schema);
    applySchema(values.schema);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" disabled={data.length === 0}>
          <Pencil2Icon />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[800px]">
        <DialogHeader>
          <DialogTitle>Define Naming Schema</DialogTitle>
          <DialogDescription className="whitespace-pre-line">
            {`Define a schema for naming exported files. 
            To preserve a part of the original file name add the index of the token in curly braces.`}
          </DialogDescription>
        </DialogHeader>
        <Label className="grid grid-cols-5 font-mono">
          {tokenized.map((token, index) => (
            <span key={index} className="mr-2">
              {index}: {token}
            </span>
          ))}
        </Label>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col space-y-2"
          >
            <FormField
              control={form.control}
              name="schema"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Schema</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormDescription>
                    Leave blank to preserve file name.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="ml-auto">
              Save
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
