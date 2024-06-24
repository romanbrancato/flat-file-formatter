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
import { DataContext } from "@/context/data-context";

interface NewPresetButtonProps {
  trigger: React.ReactNode;
}

const newPresetSchema = z.object({
  name: z.string().min(1, "Enter a preset name."),
});

export function PresetNewButton({ trigger }: NewPresetButtonProps) {
  const { data } = useContext(DataContext);
  const { setOrder, setName, savePreset } = useContext(PresetContext);
  const [open, setOpen] = useState(false);

  const form = useForm<z.infer<typeof newPresetSchema>>({
    resolver: zodResolver(newPresetSchema),
    defaultValues: {
      name: "",
    },
  });

  function onSubmit(values: z.infer<typeof newPresetSchema>) {
    setName(values.name);
    setOrder(Object.keys(data[0]));
    savePreset();
    setOpen(false);
    form.reset();
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[800px]">
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
            <Button type="submit" className="w-1/3 ml-auto">
              Save
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
