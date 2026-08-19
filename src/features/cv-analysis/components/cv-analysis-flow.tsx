"use client";

import type { ReactNode } from "react";

import { AnalysisEmptyState } from "@/features/cv-analysis/components/analysis-empty-state";
import { AnalysisErrorState } from "@/features/cv-analysis/components/analysis-error-state";
import { AnalysisLoadingState } from "@/features/cv-analysis/components/analysis-loading-state";
import { CvDropzone } from "@/features/cv-analysis/components/cv-dropzone";
import { CvForm } from "@/features/cv-analysis/components/cv-form";
import { RejectedFilesAlert } from "@/features/cv-analysis/components/rejected-files-alert";
import { useCvAnalysis } from "@/features/cv-analysis/hooks/use-cv-analysis";
import { useCvFile } from "@/features/cv-analysis/hooks/use-cv-file";

/**
 * Punto de entrada de cliente de la feature: compone la selección de archivo con
 * la máquina de estados del análisis y decide qué se ve en cada estado.
 */
export function CvAnalysisFlow() {
  const { file, rejected, selectFile, clearFile, dismissRejected } =
    useCvFile();
  const { state, analyze, reset } = useCvAnalysis();

  const handleAnalyze = () => {
    if (!file) return;
    void analyze(file.file);
  };

  const handleAnalyzeAnother = () => {
    reset();
    clearFile();
  };

  const renderAnalysis = (): ReactNode => {
    switch (state.status) {
      case "idle":
        return <AnalysisEmptyState />;
      case "uploading":
        return <AnalysisLoadingState uploadPercent={state.percent} />;
      case "analyzing":
        return <AnalysisLoadingState uploadPercent={null} />;
      case "error":
        return (
          <AnalysisErrorState
            message={state.message}
            onRetry={handleAnalyze}
            canRetry={file !== null}
          />
        );
      case "success":
        return (
          <CvForm
            result={state.result}
            onAnalyzeAnother={handleAnalyzeAnother}
          />
        );
    }
  };

  return (
    <>
      <CvDropzone
        file={file}
        status={state.status}
        onFilesSelected={selectFile}
        onRemoveFile={clearFile}
        onAnalyze={handleAnalyze}
      />

      {rejected.length > 0 && (
        <RejectedFilesAlert rejected={rejected} onDismiss={dismissRejected} />
      )}

      <div className="mt-7">{renderAnalysis()}</div>
    </>
  );
}
