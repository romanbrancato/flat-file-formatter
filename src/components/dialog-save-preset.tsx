import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { FloatingLabelInput } from "@/components/ui/floating-label-input";
import { z } from "zod";
import { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PresetContext } from "@/context/preset-context";

const SavePresetSchema = z.object({
  name: z.string().min(1, "Enter a preset name."),
});

export function DialogSavePreset({ children }: { children: React.ReactNode }) {
  const { preset, setPreset } = useContext(PresetContext);
  const [open, setOpen] = useState(false);

  const form = useForm<z.infer<typeof SavePresetSchema>>({
    resolver: zodResolver(SavePresetSchema),
    defaultValues: { name: preset.name || "" },
  });

  function onSubmit(values: z.infer<typeof SavePresetSchema>) {
    const tempPreset = {
      ...preset,
      name: values.name,
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
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-h-[75%] max-w-[50%] overflow-auto">
        <DialogHeader>
          <DialogTitle>Save Preset</DialogTitle>
          <DialogDescription>
            Save your changes to a preset to make them repeatable.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-y-1"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <FloatingLabelInput label="Name" {...field} />
                  </FormControl>
                  <FormDescription>Give a name to the preset.</FormDescription>
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
