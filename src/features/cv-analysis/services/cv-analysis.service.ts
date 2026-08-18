import { endpoints } from "@/config/endpoints";
import { postFormData, type UploadProgress } from "@/services/api-client";

import {
  cvAnalysisResultSchema,
  type CvAnalysisResult,
} from "@/features/cv-analysis/schemas/cv-analysis.schema";

export interface AnalyzeCvOptions {
  files: File[];
  signal?: AbortSignal;
  onUploadProgress?: (progress: UploadProgress) => void;
  onUploadComplete?: () => void;
}

/**
 * Envía los archivos al Route Handler de análisis y devuelve el resultado ya
 * validado. La inferencia vive en el backend; aquí solo se transporta.
 */
export async function analyzeCv({
  files,
  signal,
  onUploadProgress,
  onUploadComplete,
}: AnalyzeCvOptions): Promise<CvAnalysisResult> {
  const body = new FormData();
  for (const file of files) {
    body.append(endpoints.cvAnalysis.filesField, file, file.name);
  }

  return postFormData({
    path: endpoints.cvAnalysis.analyze,
    body,
    schema: cvAnalysisResultSchema,
    signal,
    onUploadProgress,
    onUploadComplete,
  });
}
