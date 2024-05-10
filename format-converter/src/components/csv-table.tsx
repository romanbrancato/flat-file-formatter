import {useState} from "react";
import {Table, TableBody, TableCell, TableHeader, TableRow} from "@/components/ui/table";
import {DragHandleDots2Icon} from "@radix-ui/react-icons";
import {
    closestCenter,
    DndContext,
    DragEndEvent,
    KeyboardSensor,
    MouseSensor,
    TouchSensor,
    useSensor,
    useSensors
} from '@dnd-kit/core';
import {arrayMove, horizontalListSortingStrategy, SortableContext, useSortable} from '@dnd-kit/sortable';
import {restrictToHorizontalAxis} from "@dnd-kit/modifiers";
import {CSS} from '@dnd-kit/utilities';

const DraggableCell = ({id, children}: any) => {
    const {attributes, listeners, setNodeRef, transform, isDragging} = useSortable({id});

    const style = {
        opacity: isDragging ? 0.8 : 1,
        cursor: isDragging ? 'grabbing' : 'grab',
        transform: CSS.Translate.toString(transform),
        zIndex: isDragging ? 1 : 0,
    };

    return (
        <TableCell style={style} ref={setNodeRef} {...attributes} {...listeners} className="whitespace-nowrap">
            {children}
        </TableCell>
    );
};

interface CSVTableProps {
    data: Record<string, unknown>[];
}

export function CSVTable({data}: CSVTableProps) {
    const headers = data.length > 0 ? Object.keys(data[0]) : [];
    const [columnOrder, setColumnOrder] = useState<string[]>(headers);

    const handleDragEnd = (event: DragEndEvent) => {
        const {active, over} = event;
        if (active && over && active.id !== over.id) {
            setColumnOrder((columnOrder) => {
                const oldIndex = columnOrder.indexOf(active.id as string);
                const newIndex = columnOrder.indexOf(over.id as string);
                return arrayMove(columnOrder, oldIndex, newIndex);
            });
        }
    };

    const sensors = useSensors(
        useSensor(MouseSensor, {}),
        useSensor(TouchSensor, {}),
        useSensor(KeyboardSensor, {})
    )

    return (
        <DndContext
            collisionDetection={closestCenter}
            modifiers={[restrictToHorizontalAxis]}
            onDragEnd={handleDragEnd}
            sensors={sensors}
        >
            <Table>
                <TableHeader>
                    <SortableContext items={columnOrder} strategy={horizontalListSortingStrategy}>
                        <TableRow>
                            {columnOrder.map((header) => (
                                <DraggableCell key={header} id={header}>
                                    <div className="flex flex-row items-center">
                                        {header}
                                        <DragHandleDots2Icon className="ml-2"/>
                                    </div>
                                </DraggableCell>
                            ))}
                        </TableRow>
                    </SortableContext>
                </TableHeader>
                <TableBody>
                    {data.slice(0, 10).map((row, i) => (
                        <TableRow key={i}>
                            {columnOrder.map((header) => (
                                <SortableContext key={header} items={columnOrder} strategy={horizontalListSortingStrategy}>
                                    <DraggableCell key={header} id={header}>
                                        {row[header] as string}
                                    </DraggableCell>
                                </SortableContext>
                            ))}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </DndContext>
    );
}