import {useContext, useState} from "react";
import {DataContext} from "@/context/data-context";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog";
import {Pencil2Icon} from "@radix-ui/react-icons";
import {Button} from "@/components/ui/button";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {FieldValues, SubmitHandler, useForm} from "react-hook-form";
import {Input} from "@/components/ui/input";
import {ScrollArea, ScrollAreaViewport} from "@/components/ui/scroll-area";
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";

const defineWidthsSchema = z.object({
    widths: z.record(z.coerce.number({message: "Enter a width."
    }).gte(1, "Width must be at least 1."))
});

export function DefineWidthsButton() {
    const [open, setOpen] = useState(false)
    const {data} = useContext(DataContext)
    const fields = Object.keys(data[0] || {})

    const form = useForm({
        resolver: zodResolver(defineWidthsSchema),
        defaultValues:{
            widths: Object.fromEntries(fields.map((field) => [field, 0]))
        }
    })

    const onSubmit: SubmitHandler<FieldValues> = (values) => {
        const widthsArray = Object.entries(values.widths).map(([key, value]) => ({ [key]: value }));
        console.log(widthsArray); // You can do whatever you want with this array

        setOpen(false);
        form.reset();
    };


    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="w-full border-dashed mb-2">
                    <Pencil2Icon className="mr-2"/>
                    Define Widths
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] max-h-[800px]">
                <DialogHeader>
                    <DialogTitle>Define Widths</DialogTitle>
                    <DialogDescription className="flex flex-row justify-between">
                        Define the widths of each field in characters.
                        <Button onClick={()=> form.handleSubmit(onSubmit)()}>
                            Save
                        </Button>
                    </DialogDescription>
                </DialogHeader>
                <ScrollArea>
                    <ScrollAreaViewport className="max-h-[400px]">
                        <Form {...form}>
                            <form
                                className="space-y-2"
                                onSubmit={form.handleSubmit(onSubmit)}>
                                {fields.map((fieldName) => (
                                    <FormField
                                        control={form.control}
                                        name={`widths.${fieldName}`}
                                        key={fieldName}
                                        render={({field}) => (
                                            <FormItem className="pr-3 pl-1">
                                                <FormLabel>{fieldName}</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            {...field}
                                                            type="number"
                                                            min={0}
                                                        />
                                                    </FormControl>
                                                <FormMessage/>
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