import { Button } from "@/components/ui/button";

import { CvFileItem } from "@/features/cv-analysis/components/cv-file-item";
import type { SelectedFile } from "@/features/cv-analysis/types/cv.types";

interface CvFileListProps {
  files: SelectedFile[];
  onRemove: (id: string) => void;
  onClear: () => void;
}

export function CvFileList({ files, onRemove, onClear }: CvFileListProps) {
  const label =
    files.length === 1
      ? "1 archivo seleccionado"
      : `${files.length} archivos seleccionados`;

  return (
    <div className="px-2 pt-1.5">
      <div className="flex items-center justify-between px-1.5 pt-5 pb-3">
        <p className="text-sm text-panel-foreground/55">{label}</p>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onClear}
          className="text-panel-foreground/55 hover:bg-panel-foreground/10 hover:text-panel-foreground dark:hover:bg-panel-foreground/10"
        >
          Limpiar todo
        </Button>
      </div>

      <ul className="flex flex-col gap-2">
        {files.map((file) => (
          <CvFileItem key={file.id} file={file} onRemove={onRemove} />
        ))}
      </ul>
    </div>
  );
}
