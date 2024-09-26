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
import { SelectTag } from "@/components/select-tag";

export function ButtonOperations() {
  const { isReady, evaluateConditions, evaluateEquation, reformatData } =
    useContext(ParserContext);
  const { preset, setPreset } = useContext(PresetContext);
  const [open, setOpen] = useState(false);
  const form = useForm({
    resolver: zodResolver(OperationSchema),
    defaultValues: {
      operation: "",
      tag: "detail",
      direction: "row",
      conditions: [
        { statement: "if", field: null, comparison: "=", value: "" },
      ],
      equation: [{ operator: "+", field: null }],
      fields: [{ tag: "", name: "" }],
      actionTrue: { values: [{ field: null, value: "" }] },
      actionFalse: { values: [{ field: null, value: "" }] },
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
      <DialogContent className="max-h-[800px] sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>Define Operation</DialogTitle>
          <DialogDescription className="flex flex-row items-center justify-between">
            Perform various operations.
          </DialogDescription>
        </DialogHeader>
        <FormProvider {...form}>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-col gap-y-1"
            >
              <FormField
                control={form.control}
                name="operation"
                render={({ field }) => (
                  <FormItem>
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
              {operation != "" && (
                <>
                  <Separator />
                  <FormField
                    control={form.control}
                    name="tag"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <SelectTag
                            label="Tag"
                            selectedTag={field.value}
                            onTagSelect={(tag: string) => {
                              field.onChange(tag);
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              )}
              {operation === "conditional" && <FormConditional />}
              {operation === "equation" && <FormEquation />}
              {operation === "reformat" && <FormReformat />}
              <Button type="submit" className="ml-auto w-1/3">
                Apply
              </Button>
            </form>
          </Form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
}
