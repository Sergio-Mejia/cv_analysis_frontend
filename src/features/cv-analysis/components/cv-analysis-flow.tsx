"use client";

import type { ReactNode } from "react";

import { AnalysisEmptyState } from "@/features/cv-analysis/components/analysis-empty-state";
import { AnalysisErrorState } from "@/features/cv-analysis/components/analysis-error-state";
import { AnalysisLoadingState } from "@/features/cv-analysis/components/analysis-loading-state";
import { CvDropzone } from "@/features/cv-analysis/components/cv-dropzone";
import { CvForm } from "@/features/cv-analysis/components/cv-form";
import { RejectedFilesAlert } from "@/features/cv-analysis/components/rejected-files-alert";
import { useCvAnalysis } from "@/features/cv-analysis/hooks/use-cv-analysis";
import { useCvFiles } from "@/features/cv-analysis/hooks/use-cv-files";

/**
 * Punto de entrada de cliente de la feature: compone la selección de archivos
 * con la máquina de estados del análisis y decide qué se ve en cada estado.
 */
export function CvAnalysisFlow() {
  const { files, rejected, addFiles, removeFile, clearFiles, dismissRejected } =
    useCvFiles();
  const { state, analyze, reset } = useCvAnalysis();

  const handleAnalyze = () => {
    void analyze(files.map((selected) => selected.file));
  };

  const handleAnalyzeAnother = () => {
    reset();
    clearFiles();
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
            canRetry={files.length > 0}
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
        files={files}
        status={state.status}
        onFilesSelected={addFiles}
        onRemoveFile={removeFile}
        onClearFiles={clearFiles}
        onAnalyze={handleAnalyze}
      />

      {rejected.length > 0 && (
        <RejectedFilesAlert rejected={rejected} onDismiss={dismissRejected} />
      )}

      <div className="mt-7">{renderAnalysis()}</div>
    </>
  );
}
