import { FieldAddButton } from "@/components/field-add-button";
import { FieldRemoveButton } from "@/components/field-remove-button";
import { FieldEditButton } from "@/components/field-edit-button";
import {TestFieldEditButton} from "@/components/test-field-edit";

export function TableToolbar() {
  return (
    <div className="flex flex-row gap-x-1 md:w-1/2">
      <FieldAddButton />
      <FieldRemoveButton />
      {/*<FieldEditButton />*/}
      <TestFieldEditButton />
    </div>
  );
}
