import { ContextMenuContent, ContextMenuItem } from "../ui/context-menu";

export function TerminalContextMenu() {
  return (
    <ContextMenuContent>
      <ContextMenuItem>Profile</ContextMenuItem>
      <ContextMenuItem>Billing</ContextMenuItem>
      <ContextMenuItem>Team</ContextMenuItem>
      <ContextMenuItem>Subscription</ContextMenuItem>
    </ContextMenuContent>
  );
}
