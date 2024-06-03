import { CSSProperties, useContext, useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  closestCenter,
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  horizontalListSortingStrategy,
  SortableContext,
  useSortable,
} from "@dnd-kit/sortable";
import { restrictToHorizontalAxis } from "@dnd-kit/modifiers";
import { CSS } from "@dnd-kit/utilities";
import {
  ColumnDef,
  getCoreRowModel,
  getPaginationRowModel,
} from "@tanstack/table-core";
import { flexRender, useReactTable } from "@tanstack/react-table";
import { DragHandleDots2Icon, InfoCircledIcon } from "@radix-ui/react-icons";
import { DataContext } from "@/context/data-context";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

const DraggableTableHeader = ({ header }: any) => {
  const { attributes, isDragging, listeners, setNodeRef, transform } =
    useSortable({
      id: header.column.id,
    });

  const style: CSSProperties = {
    opacity: isDragging ? 0.8 : 1,
    cursor: isDragging ? "grabbing" : "grab",
    transform: CSS.Translate.toString(transform),
    zIndex: isDragging ? 1 : 0,
    whiteSpace: "nowrap",
  };

  return (
    <TableHead
      colSpan={header.colSpan}
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
    >
      {header.isPlaceholder ? null : (
        <div className="flex flex-row items-center">
          <span>
            {flexRender(header.column.columnDef.header, header.getContext())}{" "}
          </span>
          <DragHandleDots2Icon className="ml-auto" />
        </div>
      )}
    </TableHead>
  );
};

const DraggableCell = ({ cell }: any) => {
  const { attributes, isDragging, listeners, setNodeRef, transform } =
    useSortable({
      id: cell.column.id,
    });

  const style: CSSProperties = {
    opacity: isDragging ? 0.8 : 1,
    cursor: isDragging ? "grabbing" : "grab",
    transform: CSS.Translate.toString(transform),
    zIndex: isDragging ? 1 : 0,
    whiteSpace: "nowrap",
  };

  return (
    <TableCell style={style} ref={setNodeRef} {...attributes} {...listeners}>
      {flexRender(cell.column.columnDef.cell, cell.getContext())}
    </TableCell>
  );
};

export function CSVTable() {
  const { data, orderFields } = useContext(DataContext);
  const [columns, setColumns] = useState<ColumnDef<Record<string, unknown>>[]>(
    [],
  );
  const [columnOrder, setColumnOrder] = useState<string[]>([]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: {
      columnOrder,
      pagination: {
        pageIndex: 0,
        pageSize: 20,
      },
    },
    onColumnOrderChange: setColumnOrder,
  });

  useEffect(() => {
    const fields = Object.keys(data[0] || {});
    const newColumns = fields.map((field) => ({
      accessorKey: field,
    }));
    setColumns(newColumns);
    setColumnOrder(newColumns.map((c) => c.accessorKey!));
  }, [data]);

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (active && over && active.id !== over.id) {
      const oldIndex = columnOrder.indexOf(active.id as string);
      const newIndex = columnOrder.indexOf(over.id as string);
      const newColumnOrder = arrayMove(columnOrder, oldIndex, newIndex);
      setColumnOrder(newColumnOrder);
      orderFields(newColumnOrder);
    }
  }

  const sensors = useSensors(
    useSensor(MouseSensor, {}),
    useSensor(TouchSensor, {}),
    useSensor(KeyboardSensor, {}),
  );

  return (
    <div className="rounded-md border flex-grow">
      {data.length > 0 ? (
        <DndContext
          collisionDetection={closestCenter}
          modifiers={[restrictToHorizontalAxis]}
          onDragEnd={handleDragEnd}
          sensors={sensors}
        >
          <ScrollArea className="h-full">
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    <SortableContext
                      items={columnOrder}
                      strategy={horizontalListSortingStrategy}
                    >
                      {headerGroup.headers.map((header) => (
                        <DraggableTableHeader key={header.id} header={header} />
                      ))}
                    </SortableContext>
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id}>
                    {row.getVisibleCells().map((cell) => (
                      <SortableContext
                        key={cell.id}
                        items={columnOrder}
                        strategy={horizontalListSortingStrategy}
                      >
                        <DraggableCell cell={cell} />
                      </SortableContext>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </DndContext>
      ) : (
        <div className="flex items-center justify-center h-full">
          <Alert className="md:w-1/2 m-3 min-w-fit">
            <InfoCircledIcon />
            <AlertTitle>No File Uploaded</AlertTitle>
            <AlertDescription>
              Upload a file above to get started.
            </AlertDescription>
          </Alert>
        </div>
      )}
    </div>
  );
}
