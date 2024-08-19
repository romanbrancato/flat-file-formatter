import { useContext, useMemo, useState } from "react";
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
import { ParserContext } from "@/context/parser-context";
import path from "node:path";

const PatternSchema = z.object({
  pattern: z.string(),
});

export function ButtonDefinePattern() {
  const { params, isReady, applyPattern } = useContext(ParserContext);
  const { preset, setPreset } = useContext(PresetContext);
  const [open, setOpen] = useState(false);

  const tokens = useMemo(() => {
    return params?.file ? tokenize(path.parse(params.file.name).name) : [];
  }, [params?.file]);

  const form = useForm({
    resolver: zodResolver(PatternSchema),
    defaultValues: {
      pattern: "",
    },
  });

  const onSubmit: SubmitHandler<FieldValues> = (values) => {
    applyPattern(values.pattern);
    setPreset({
      ...preset,
      changes: {
        ...preset.changes,
        pattern: values.pattern,
      },
    });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="flex-shrink-0 mx-1"
          disabled={!isReady}
        >
          <Pencil2Icon />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[800px]">
        <DialogHeader>
          <DialogTitle>Define Naming Schema</DialogTitle>
          <DialogDescription className="whitespace-pre-line leading-tight">
            {`Define a pattern for exported file names. 
            To preserve a part of the original file name, add the index of the token in curly braces.`}
          </DialogDescription>
        </DialogHeader>
        <Label className="grid grid-cols-5 font-mono">
          {tokens.map((token, index) => (
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
              name="pattern"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Pattern</FormLabel>
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
            <Button type="submit" className="ml-auto w-1/3">
              Save
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
