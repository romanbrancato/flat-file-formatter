import { useRef, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { UploadIcon } from "@radix-ui/react-icons";

export function Dropzone({
  onChange,
  className,
  accept,
  multiple = false,
  ...props
}: {
  onChange: React.Dispatch<React.SetStateAction<File[]>>;
  className?: string;
  accept?: string[];
  multiple?: boolean;
}) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const { files } = e.dataTransfer;
    handleFiles(files);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    if (files) {
      handleFiles(files);
    }
    // Makes onChange trigger even if user uploads the same file (allows for "resetting" the file to default if needed)
    e.target.value = "";
  };

  const handleFiles = (files: FileList) => {
    const uploadedFiles = Array.from(files);

    if (accept && accept.length > 0) {
      const invalidFiles = uploadedFiles.filter(
        (file) =>
          !accept.some((ext) =>
            file.name.toLowerCase().endsWith(ext.toLowerCase()),
          ),
      );
      if (invalidFiles.length) {
        setError(`Invalid file type. Expected: ${accept.join(", ")}`);
        return;
      }
    }

    uploadedFiles.forEach((file) => {
      onChange((prevFiles) => [...prevFiles, file]);
    });

    setError(null);
  };

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <Card
      className={`border border-dashed border-muted-foreground/50 bg-muted hover:cursor-pointer hover:border-muted-foreground ${className}`}
      {...props}
    >
      <CardContent
        className="flex flex-col items-center justify-center space-y-2 px-2 py-4 font-mono text-xs text-muted-foreground"
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={handleButtonClick}
      >
        <UploadIcon />
        <div className="flex items-center justify-center">
          <span>Drag files here or click to upload.</span>
          <input
            ref={fileInputRef}
            type="file"
            accept={accept?.join(",")}
            onChange={handleFileInputChange}
            className="hidden"
            multiple={multiple}
          />
        </div>
        {error && <span className="text-destructive">{error}</span>}
      </CardContent>
    </Card>
  );
}
