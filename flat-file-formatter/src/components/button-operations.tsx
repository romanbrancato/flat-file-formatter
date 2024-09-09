import { useContext, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { GearIcon } from "@radix-ui/react-icons";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { FormProvider, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PresetContext } from "@/context/preset-context";
import { ParserContext } from "@/context/parser-context";
import { SelectOperation } from "@/components/select-operation";
import { OperationSchema } from "@/types/schemas";
import { FormConditional } from "@/components/forms/form-conditional";
import { FormEquation } from "@/components/forms/form-equation";
import { FormReformat } from "@/components/forms/form-reformat";
import { Separator } from "@/components/ui/separator";

export function ButtonOperations() {
  const { isReady, evaluateConditions, evaluateEquation, reformatData } =
    useContext(ParserContext);
  const { preset, setPreset } = useContext(PresetContext);
  const [open, setOpen] = useState(false);
  const form = useForm({
    resolver: zodResolver(OperationSchema),
    defaultValues: {
      operation: "",
      conditions: [
        {
          statement: "if",
          field: { name: "", flag: "" },
          comparison: "=",
          value: "",
        },
      ],
      direction: "column",
      formula: [
        {
          operator: "+",
          field: { name: "", flag: "" },
        },
      ],
      output: {},
      fields: [
        {
          field: { name: "", flag: "" },
        },
      ],
      details: {
        type: "",
        pattern: "",
      },
      field: {
        name: "",
        flag: "",
      },
    },
  });

  const operation = useWatch({
    control: form.control,
    name: "operation",
  });

  function onSubmit(values: any) {
    if (values.operation === "conditional") {
      evaluateConditions(values);
    }
    if (values.operation === "equation") {
      evaluateEquation(values);
    }
    if (values.operation === "reformat") {
      reformatData(values);
    }
    setPreset({
      ...preset,
      changes: {
        ...preset.changes,
        history: [...preset.changes.history, values],
      },
    });

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
          disabled={!isReady}
        >
          <GearIcon className="mr-2" />
          Operations
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px] max-h-[800px]">
        <DialogHeader>
          <DialogTitle>Define Operation</DialogTitle>
          <DialogDescription className="flex flex-row justify-between items-center">
            Perform various operations.
          </DialogDescription>
        </DialogHeader>
        <FormProvider {...form}>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                control={form.control}
                name="operation"
                render={({ field }) => (
                  <FormItem className="mb-1">
                    <FormControl>
                      <SelectOperation
                        selectedOperation={field.value}
                        onOperationSelect={(selectedOperation: string) => {
                          field.onChange(selectedOperation);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {operation === "conditional" && <FormConditional />}
              {operation === "equation" && <FormEquation />}
              {operation === "reformat" && <FormReformat />}
              <div className="flex">
                <Button type="submit" className="w-1/3 ml-auto mt-1">
                  Apply
                </Button>
              </div>
            </form>
          </Form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
}
