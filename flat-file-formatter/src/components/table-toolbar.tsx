import { ButtonAddField } from "@/components/button-add-field";
import { ButtonRemoveField } from "@/components/button-remove-field";
import { ButtonEditField } from "@/components/button-edit-field";

export function TableToolbar() {
  return (
    <div className="flex flex-row gap-x-1 md:w-1/2">
      <ButtonAddField />
      <ButtonRemoveField />
      <ButtonEditField />
    </div>
  );
}
