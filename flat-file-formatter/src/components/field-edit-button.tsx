import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Pencil1Icon } from "@radix-ui/react-icons";
import { SelectField } from "@/components/select-field";
import { Input } from "@/components/ui/input";
import { useContext, useState } from "react";
import { DataContext } from "@/context/data-context";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PresetContext } from "@/context/preset-context";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const editFieldSchema = z.object({
  field: z.string({ required_error: "Select a field to edit." }),
  value: z.string(),
});

export function FieldEditButton() {
  const {
    data,
    editValues: dataEditValues,
    editHeader: dataEditHeader,
  } = useContext(DataContext);
  const { editValues: presetEditValues, editHeader: presetEditHeader } =
    useContext(PresetContext);
  const [open, setOpen] = useState(false);
  const [target, setTarget] = useState<"header" | "values">("header");

  const form = useForm<z.infer<typeof editFieldSchema>>({
    resolver: zodResolver(editFieldSchema),
    defaultValues: {
      value: "",
    },
  });

  function onSubmit(values: z.infer<typeof editFieldSchema>) {
    if (target === "values") {
      dataEditValues({ [values.field]: values.value });
      presetEditValues({ [values.field]: values.value });
    } else {
      dataEditHeader({ [values.field]: values.value });
      presetEditHeader({ [values.field]: values.value });
    }
    setOpen(false);
    form.reset();
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild className="flex-1">
        <Button
          variant="outline"
          size="sm"
          className="w-full border-dashed"
          disabled={data.length === 0}
        >
          <Pencil1Icon className="mr-2" />
          Edit Field
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[800px]">
        <DialogHeader>
          <DialogTitle>Edit Field</DialogTitle>
          <DialogDescription className="flex flex-row justify-between items-center">
            Select a field then change its name or values.
            <Select
              defaultValue={target}
              onValueChange={(value: "header" | "values") => setTarget(value)}
            >
              <SelectTrigger className="h-7 w-[145px] text-xs ml-auto text-foreground">
                <span className="text-muted-foreground">Target: </span>
                <SelectValue placeholder="Select target" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem key="header" value="header" className="text-xs">
                  Header
                </SelectItem>
                <SelectItem key="values" value="values" className="text-xs">
                  Values
                </SelectItem>
              </SelectContent>
            </Select>
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-y-2"
          >
            <FormField
              control={form.control}
              name="field"
              render={() => (
                <FormItem>
                  <FormControl>
                    <SelectField
                      onFieldSelect={(selectedField) =>
                        form.setValue("field", selectedField, {
                          shouldValidate: true,
                        })
                      }
                    />
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
                    <Input
                      placeholder={
                        target === "header"
                          ? "Change name to..."
                          : "Change values to..."
                      }
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-1/3 ml-auto">
              Edit
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
