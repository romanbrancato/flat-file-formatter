import { useContext, useState } from "react";
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
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { ScrollArea, ScrollAreaViewport } from "@/components/ui/scroll-area";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Label } from "@/components/ui/label";
import { PresetContext } from "@/context/preset-context";
import { ParserContext } from "@/context/parser-context";

const defineWidthsSchema = z.object({
  widths: z.record(
    z.coerce
      .number({
        message: "Enter a width.",
      })
      .gte(1, "Width must be at least 1."),
  ),
});

export function ButtonDefineWidths() {
  const { data, isReady } = useContext(ParserContext);
  const { preset, setPreset } = useContext(PresetContext);
  const [open, setOpen] = useState(false);

  const form = useForm({
    resolver: zodResolver(defineWidthsSchema),
    defaultValues: {
      widths: Object.fromEntries(
        Object.keys(data.detail[0]).map((field) => {
          const presetWidth = preset.widths.find((item) => field in item);
          return [field, presetWidth ? presetWidth[field] : ""];
        }),
      ),
    },
  });

  const onSubmit: SubmitHandler<FieldValues> = (values) => {
    const widthsArray: Record<string, number>[] = Object.entries(
      values.widths,
    ).map(([key, value]) => ({
      [key]: value as number,
    }));

    setPreset({ ...preset, widths: widthsArray });

    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="w-full border-dashed"
          disabled={!isReady}
        >
          <Pencil2Icon className="mr-2" />
          Define Widths
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[800px]">
        <DialogHeader>
          <DialogTitle>Define Widths</DialogTitle>
          <DialogDescription className="flex flex-row justify-between items-center">
            Define the widths of each field in characters.
            <Button
              onClick={() => form.handleSubmit(onSubmit)()}
              className="w-1/3"
            >
              Save
            </Button>
          </DialogDescription>
        </DialogHeader>
        <ScrollArea>
          <ScrollAreaViewport className="max-h-[400px]">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                {Object.keys(data.detail[0]).map((fieldName) => (
                  <FormField
                    control={form.control}
                    name={`widths.${fieldName}`}
                    key={fieldName}
                    render={({ field }) => (
                      <FormItem className="pr-3 pl-1 pb-1">
                        <Label>{fieldName}</Label>
                        <FormControl>
                          <Input {...field} type="number" min={0} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ))}
              </form>
            </Form>
          </ScrollAreaViewport>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
