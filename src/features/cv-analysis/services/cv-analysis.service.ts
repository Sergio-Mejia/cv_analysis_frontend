import { resolveMimeType } from "@/config/cv-upload";
import { endpoints } from "@/config/endpoints";
import { postJson, putFile, type UploadProgress } from "@/services/api-client";

import {
  cvAnalysisResultSchema,
  presignedUploadSchema,
  type CvAnalysisResult,
  type PresignedUrlRequest,
} from "@/features/cv-analysis/schemas/cv-analysis.schema";

export interface AnalyzeCvOptions {
  file: File;
  signal?: AbortSignal;
  onUploadProgress?: (progress: UploadProgress) => void;
  /** Se llama cuando el archivo ya está en S3 y empieza el análisis. */
  onUploadComplete?: () => void;
}

/**
 * Analiza una hoja de vida en tres pasos:
 *
 * 1. Pide al backend una URL firmada de S3 para este archivo.
 * 2. Sube el archivo directamente a S3 con esa URL. La clave del objeto ya va
 *    dentro de la URL firmada, así que no hay que renombrar nada.
 * 3. Manda a analizar esa clave y devuelve el resultado validado.
 *
 * La inferencia vive entera en el backend; aquí solo se orquesta el transporte.
 */
export async function analyzeCv({
  file,
  signal,
  onUploadProgress,
  onUploadComplete,
}: AnalyzeCvOptions): Promise<CvAnalysisResult> {
  const contentType = resolveMimeType(file);

  const presignedRequest: PresignedUrlRequest = {
    fileName: file.name,
    fileType: contentType,
  };

  const { presignedUrl, key } = await postJson({
    path: endpoints.cvAnalysis.presignedUrl,
    body: presignedRequest,
    schema: presignedUploadSchema,
    signal,
  });

  await putFile({
    url: presignedUrl,
    file,
    contentType,
    signal,
    onProgress: onUploadProgress,
  });

  onUploadComplete?.();

  return postJson({
    path: endpoints.cvAnalysis.analyze,
    body: { s3Key: key },
    schema: cvAnalysisResultSchema,
    signal,
  });
}
