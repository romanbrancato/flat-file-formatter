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
import {useForm} from "react-hook-form";
import {Input} from "@/components/ui/input";
import {ScrollArea, ScrollAreaViewport} from "@/components/ui/scroll-area";

export function DefineWidthsButton() {
    const [open, setOpen] = useState(false)
    const {data} = useContext(DataContext)

    const form = useForm({
        defaultValues: data[0] ? Object.keys(data[0]).reduce((acc, curr) => ({...acc, [curr]: 0}), {}) : {},
    })

    function onSubmit(values: Record<string, number>) {
        // Update the widths field in the data here
        setOpen(false);
        form.reset()
    }

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
                        <Button type="submit">
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
                                {data[0] ? Object.keys(data[0]).map((column) => (
                                    <FormField
                                        control={form.control}
                                        name={column as any}
                                        key={column}
                                        render={({field}) => (
                                            <FormItem>
                                                <FormLabel>{column}</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        {...field}
                                                        type="number"
                                                        min="1"
                                                    />
                                                </FormControl>
                                                <FormMessage/>
                                            </FormItem>
                                        )}
                                    />
                                )) : <p>Awaiting File...</p>}
                            </form>
                        </Form>
                    </ScrollAreaViewport>
                </ScrollArea>
            </DialogContent>
        </Dialog>
    );
}