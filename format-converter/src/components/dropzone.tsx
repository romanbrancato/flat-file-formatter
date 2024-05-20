import React, {useRef, useState} from 'react';
import {Card, CardContent} from '@/components/ui/card';
import {UploadIcon} from "@radix-ui/react-icons";

interface DropzoneProps {
    onChange: (file: File | null) => void;
    className?: string;
    fileExtension?: string;
}

export function Dropzone({
                             onChange,
                             className,
                             fileExtension,
                             ...props
                         }: DropzoneProps) {
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [fileInfo, setFileInfo] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        const {files} = e.dataTransfer;
        handleFile(files[0]);
    };

    const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {files} = e.target;
        if (files) {
            handleFile(files[0]);
        }
    };

    const handleFile = (file: File) => {
        if (fileExtension && file && !file.name.endsWith(`.${fileExtension}`)) {
            setError(`Invalid file type. Expected: .${fileExtension}`);
            return;
        }

        const fileSizeInKB = Math.round(file.size / 1024);
        onChange(file);
        setFileInfo(`Uploaded file: ${file.name} (${fileSizeInKB} KB)`);
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
                className="flex flex-col items-center justify-center space-y-2 px-2 py-4 text-xs text-muted-foreground font-mono"
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onClick={handleButtonClick}
            >
                <UploadIcon/>
                <div className="flex items-center justify-center">
                    <span>Drag file here or click to upload.</span>
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept={`.${fileExtension}`}
                        onChange={handleFileInputChange}
                        className="hidden"
                    />
                </div>
                {fileInfo && <p className="text-muted-foreground">{fileInfo}</p>}
                {error && <span className="text-destructive">{error}</span>}
            </CardContent>
        </Card>
    );
}