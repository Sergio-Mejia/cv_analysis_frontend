import { Spinner } from "@/components/common/spinner";
import { Button } from "@/components/ui/button";

import type { CvAnalysisState } from "@/features/cv-analysis/types/cv.types";

interface AnalyzeButtonProps {
  fileCount: number;
  status: CvAnalysisState["status"];
  onAnalyze: () => void;
}

function buildLabel(fileCount: number, status: CvAnalysisState["status"]): string {
  if (status === "uploading" || status === "analyzing") return "Analizando…";
  if (status === "success") return "Volver a analizar";
  if (fileCount === 0) return "Analiza para continuar";
  return fileCount === 1 ? "Analizar 1 archivo" : `Analizar ${fileCount} archivos`;
}

export function AnalyzeButton({
  fileCount,
  status,
  onAnalyze,
}: AnalyzeButtonProps) {
  const isPending = status === "uploading" || status === "analyzing";
  const isDisabled = isPending || fileCount === 0;

  return (
    <div className="px-2 pt-5 pb-2.5">
      <Button
        type="button"
        disabled={isDisabled}
        onClick={onAnalyze}
        className="h-12 gap-2.5 rounded-xl bg-linear-135 from-brand to-brand-accent px-6 text-base font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-40"
      >
        {isPending && <Spinner />}
        {buildLabel(fileCount, status)}
      </Button>
    </div>
  );
}
