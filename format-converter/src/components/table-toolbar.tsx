import { AddFieldButton } from "@/components/add-field-button";
import { RemoveFieldButton } from "@/components/remove-field-button";
import { EditFieldButton } from "@/components/edit-field-button";

export function TableToolbar() {
  return (
    <div className="flex flex-row gap-x-1 md:w-1/2">
      <AddFieldButton />
      <RemoveFieldButton />
      <EditFieldButton />
    </div>
  );
}
