import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog";
import {Button} from "@/components/ui/button";
import {PlusCircledIcon} from "@radix-ui/react-icons";
import {Input} from "@/components/ui/input";
import {useContext, useState} from "react";
import {DataContext} from "@/context/data-context";
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod"
import {Form, FormControl, FormField, FormItem, FormMessage} from "@/components/ui/form";
import {useForm} from "react-hook-form";

const addFieldSchema = z.object({
    name: z.string().min(1, "Enter a field name."),
    value: z.string()
});

export function AddFieldButton() {
    const {addField} = useContext(DataContext);
    const [open, setOpen] = useState(false)

    const form = useForm<z.infer<typeof addFieldSchema>>({
        resolver: zodResolver(addFieldSchema),
        defaultValues: {
            name: "",
            value: ""
        },
    })

    function onSubmit(values: z.infer<typeof addFieldSchema>) {
        addField(values.name, values.value);
        setOpen(false);
        form.reset()
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild className="flex-1">
                <Button variant="outline" size="sm" className="w-full border-dashed">
                    <PlusCircledIcon className="mr-2"/>
                    Add Field
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] max-h-[800px]">
                <DialogHeader>
                    <DialogTitle>Add Field</DialogTitle>
                    <DialogDescription>
                        Define field and what to populate it with.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-row gap-x-2">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({field}) => (
                                <FormItem className="flex-1">
                                    <FormControl>
                                        <Input
                                            placeholder="Field name"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="value"
                            render={({field}) => (
                                <FormItem className="flex-1">
                                    <FormControl>
                                        <Input
                                            placeholder="Populate with... (optional)"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                        <Button type="submit" className="flex-shrink">
                            Add
                        </Button>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}