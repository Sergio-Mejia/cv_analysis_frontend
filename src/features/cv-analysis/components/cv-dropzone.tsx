"use client";

import { useState, type ChangeEvent, type DragEvent } from "react";
import { ArrowUpIcon } from "lucide-react";

import {
  CV_FILE_INPUT_ACCEPT,
  MAX_CV_FILE_SIZE_LABEL,
} from "@/config/cv-upload";
import { cn } from "@/lib/utils";

import { AnalyzeButton } from "@/features/cv-analysis/components/analyze-button";
import { CvFileList } from "@/features/cv-analysis/components/cv-file-list";
import type {
  CvAnalysisState,
  SelectedFile,
} from "@/features/cv-analysis/types/cv.types";

interface CvDropzoneProps {
  files: SelectedFile[];
  status: CvAnalysisState["status"];
  onFilesSelected: (files: FileList | File[]) => void;
  onRemoveFile: (id: string) => void;
  onClearFiles: () => void;
  onAnalyze: () => void;
}

export function CvDropzone({
  files,
  status,
  onFilesSelected,
  onRemoveFile,
  onClearFiles,
  onAnalyze,
}: CvDropzoneProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) onFilesSelected(event.target.files);
    // Permite volver a elegir el mismo archivo después de quitarlo.
    event.target.value = "";
  };

  const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
    if (!event.dataTransfer.types.includes("Files")) return;
    event.preventDefault();
    if (!isDragging) setIsDragging(true);
  };

  const handleDragLeave = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    // Sin esta comprobación el estado parpadea al pasar por encima de los hijos.
    const next = event.relatedTarget;
    if (next instanceof Node && event.currentTarget.contains(next)) return;
    setIsDragging(false);
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    onFilesSelected(event.dataTransfer.files);
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className="relative overflow-hidden rounded-4xl bg-panel p-2 text-panel-foreground shadow-2xl shadow-brand/25"
    >
      <span
        aria-hidden="true"
        className="panel-glow pointer-events-none absolute inset-0 animate-glow"
      />

      <label className="relative block cursor-pointer rounded-3xl border-[1.5px] border-dashed border-panel-foreground/20 px-5 py-9 text-center transition-colors hover:border-panel-foreground/45 hover:bg-panel-foreground/5 has-focus-visible:border-ring has-focus-visible:ring-3 has-focus-visible:ring-ring/50 sm:px-8 sm:py-11">
        <input
          type="file"
          multiple
          accept={CV_FILE_INPUT_ACCEPT}
          onChange={handleInputChange}
          className="sr-only"
        />

        <span
          aria-hidden="true"
          className={cn(
            "pointer-events-none absolute inset-0 rounded-3xl border-[1.5px] border-brand bg-brand/15 opacity-0 transition-opacity",
            isDragging && "opacity-100",
          )}
        />

        <span className="mx-auto mb-4 flex size-15 items-center justify-center rounded-full bg-linear-135 from-brand to-brand-accent text-white shadow-lg shadow-brand/40">
          <ArrowUpIcon className="size-7" />
        </span>

        <span className="block text-xl font-semibold tracking-tight">
          Arrastra tus archivos aquí
        </span>
        <span className="mt-1.5 block text-sm text-panel-foreground/60">
          o{" "}
          <span className="text-panel-foreground underline underline-offset-[3px]">
            selecciona desde tu equipo
          </span>
        </span>
        <span className="mt-4 block text-xs tracking-wide text-panel-foreground/45">
          PDF · JPG · PNG — hasta {MAX_CV_FILE_SIZE_LABEL}
        </span>
      </label>

      {files.length > 0 && (
        <CvFileList
          files={files}
          onRemove={onRemoveFile}
          onClear={onClearFiles}
        />
      )}

      <AnalyzeButton
        fileCount={files.length}
        status={status}
        onAnalyze={onAnalyze}
      />
    </div>
  );
}
