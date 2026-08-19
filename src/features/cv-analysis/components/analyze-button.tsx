import { Spinner } from "@/components/common/spinner";
import { Button } from "@/components/ui/button";

import type { CvAnalysisState } from "@/features/cv-analysis/types/cv.types";

interface AnalyzeButtonProps {
  hasFile: boolean;
  status: CvAnalysisState["status"];
  onAnalyze: () => void;
}

function buildLabel(
  hasFile: boolean,
  status: CvAnalysisState["status"],
): string {
  if (status === "uploading" || status === "analyzing") return "Analizando…";
  if (status === "success") return "Volver a analizar";
  return hasFile ? "Analizar archivo" : "Analiza para continuar";
}

export function AnalyzeButton({
  hasFile,
  status,
  onAnalyze,
}: AnalyzeButtonProps) {
  const isPending = status === "uploading" || status === "analyzing";
  const isDisabled = isPending || !hasFile;

  return (
    <div className="px-2 pt-5 pb-2.5">
      <Button
        type="button"
        disabled={isDisabled}
        onClick={onAnalyze}
        className="h-12 gap-2.5 rounded-xl bg-linear-135 from-brand to-brand-accent px-6 text-base font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-40"
      >
        {isPending && <Spinner />}
        {buildLabel(hasFile, status)}
      </Button>
    </div>
  );
}
