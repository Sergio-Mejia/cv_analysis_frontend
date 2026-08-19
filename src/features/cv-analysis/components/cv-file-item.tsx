import { XIcon } from "lucide-react";

import { Button } from "@/components/ui/button";

import type { SelectedFile } from "@/features/cv-analysis/types/cv.types";

interface CvFileItemProps {
  file: SelectedFile;
  onRemove: () => void;
}

export function CvFileItem({ file, onRemove }: CvFileItemProps) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-panel-foreground/10 bg-panel-foreground/5 px-3 py-2.5">
      {file.previewUrl ? (
        // eslint-disable-next-line @next/next/no-img-element -- es un object URL (blob:) local, next/image no puede optimizarlo
        <img
          src={file.previewUrl}
          alt=""
          className="size-10.5 shrink-0 rounded-md object-cover"
        />
      ) : (
        <span
          aria-hidden="true"
          className="flex size-10.5 shrink-0 items-center justify-center rounded-md bg-panel-foreground/10 text-[10px] font-bold tracking-widest text-panel-foreground/75"
        >
          PDF
        </span>
      )}

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium">{file.name}</p>
        <p className="mt-0.5 text-xs text-panel-foreground/45">
          {file.sizeLabel}
        </p>
      </div>

      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        aria-label={`Quitar ${file.name}`}
        onClick={onRemove}
        className="shrink-0 bg-panel-foreground/5 text-panel-foreground/60 hover:bg-panel-foreground/15 hover:text-panel-foreground dark:hover:bg-panel-foreground/15"
      >
        <XIcon />
      </Button>
    </div>
  );
}
