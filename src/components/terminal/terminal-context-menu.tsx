import { useTables } from "@/context/tables";
import { ContextMenuContent, ContextMenuItem, ContextMenuSub, ContextMenuSubContent, ContextMenuSubTrigger } from "../ui/context-menu";
import { toast } from "sonner";
import { useTerminal } from "@/context/terminal";
import { format } from "sql-formatter";

export function TerminalContextMenu() {
  const {tables} = useTables();
  const {value, setValue} = useTerminal();


  const handleListColumns = (table: string) => {
    const columns = tables[table];
    
    const quotedColumns = columns.map(column => `"${column}"`);
    
    const columnList = quotedColumns.join(', ');
    
    navigator.clipboard.writeText(columnList)
      .then(() => 
        toast.success(`Copied columns of ${table} to clipboard`)
      )
      .catch(err => 
        toast.error(`Failed to copy columns of ${table} to clipboard:`, { description: err })
      );
  };

  return (
    <ContextMenuContent>
       <ContextMenuSub>
          <ContextMenuSubTrigger inset disabled={!Object.keys(tables).length} className="data-[disabled]:opacity-50">Copy Columns Of...</ContextMenuSubTrigger>
          <ContextMenuSubContent>
            {Object.keys(tables).map(table => (
              <ContextMenuItem key={table} onClick={() => handleListColumns(table)}>{table}</ContextMenuItem>
            ))}
          </ContextMenuSubContent>
          <ContextMenuItem inset onClick={()=>setValue(format(value, {language: "postgresql", keywordCase: "upper"}))}>Format Query</ContextMenuItem>
        </ContextMenuSub>
    </ContextMenuContent>
  );
}
