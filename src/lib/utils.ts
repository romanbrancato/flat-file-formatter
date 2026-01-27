import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import JSZip from "jszip";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function download(
  files: Array<{ content: string; filename: string }>,
  mimetype: string
) {
  // If more than 5 files, create a ZIP
  if (files.length > 5) {
    const zip = new JSZip();

    const getExtension = (mimetype: string) => {
      if (mimetype === "text/csv") return ".csv";
      if (mimetype === "text/plain") return ".txt";
      return "";
    };

    const extension = getExtension(mimetype);

    files.forEach((file) => {
      zip.file(file.filename + extension, file.content);
    });

    const zipBlob = await zip.generateAsync({ type: "blob" });
    const url = URL.createObjectURL(zipBlob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `export-${new Date().toISOString().slice(0, 10)}.zip`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => URL.revokeObjectURL(url), 60_000);

  } else {
    // Download individual files if 5 or fewer
    files.forEach((file) => {
      const blob = new Blob([file.content], { type: mimetype });
      const url = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = file.filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setTimeout(() => URL.revokeObjectURL(url), 60_000);
    });
  }
}

export function minifySQL(query: string): string {
  return query
    .replace(/\s+/g, ' ') // Replace multiple spaces and newlines with a single space
    .trim(); // Remove leading and trailing spaces
}


