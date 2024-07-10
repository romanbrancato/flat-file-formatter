import { Cross2Icon, FileTextIcon } from "@radix-ui/react-icons";

export function BatchFileRow({
  file,
  onFileDelete,
}: {
  file: File;
  onFileDelete: () => void;
}) {
  return (
    <div className="flex flex-row justify-between items-center rounded-md px-5 py-3 bg-muted text-xs font-bold">
      <div className="flex flex-row items-center gap-x-2">
        <FileTextIcon /> {file.name}
      </div>
      <span>{(file.size / 1024).toFixed(2)} KB</span>
      <Cross2Icon className="hover:text-destructive" onClick={onFileDelete} />
    </div>
  );
}
