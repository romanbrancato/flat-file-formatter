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
import { useContext, useState } from "react";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PresetContext } from "@/context/preset-context";
import { ParserContext } from "@/context/parser-context";

const NewPresetSchema = z.object({
  name: z.string().min(1, "Enter a preset name."),
});

export function ButtonNewPreset({ trigger }: { trigger: React.ReactNode }) {
  const { data, isReady } = useContext(ParserContext);
  const { preset, setPreset } = useContext(PresetContext);
  const [open, setOpen] = useState(false);

  const form = useForm<z.infer<typeof NewPresetSchema>>({
    resolver: zodResolver(NewPresetSchema),
    defaultValues: {
      name: "",
    },
  });

  function onSubmit(values: z.infer<typeof NewPresetSchema>) {
    const tempPreset = {
      ...preset,
      name: values.name,
      changes: {
        ...preset.changes,
        order: Object.fromEntries(
          Object.entries(data.records).map(([key, record]) => [
            key,
            record.fields,
          ]),
        ),
      },
    };
    localStorage.setItem(
      `preset_${tempPreset.name}`,
      JSON.stringify({ ...tempPreset }, null, 2),
    );
    window.dispatchEvent(new Event("storage"));
    setPreset(tempPreset);
    setOpen(false);
    form.reset();
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-h-[800px] sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>New Preset</DialogTitle>
          <DialogDescription>
            Define a new preset to save the current configuration.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-y-2"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormControl>
                    <Input placeholder="Name" {...field} />
                  </FormControl>
                  <FormDescription>
                    Give a name to the new preset.
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
