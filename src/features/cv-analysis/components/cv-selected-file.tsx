import { CvFileItem } from "@/features/cv-analysis/components/cv-file-item";
import type { SelectedFile } from "@/features/cv-analysis/types/cv.types";

interface CvSelectedFileProps {
  file: SelectedFile;
  onRemove: () => void;
}

/**
 * Archivo listo para analizar, dentro del panel oscuro. El diseño mostraba una
 * lista con «Limpiar todo»; con un único archivo ese botón sobra, porque la × de
 * la propia fila hace lo mismo.
 */
export function CvSelectedFile({ file, onRemove }: CvSelectedFileProps) {
  return (
    <div className="px-2 pt-1.5">
      <p className="px-1.5 pt-5 pb-3 text-sm text-panel-foreground/55">
        Archivo seleccionado
      </p>
      <CvFileItem file={file} onRemove={onRemove} />
    </div>
  );
}
