import type { CvFormValues } from "@/features/cv-analysis/schemas/cv-form.schema";

/** Archivo ya aceptado y listo para enviarse a analizar. */
export interface SelectedFile {
  id: string;
  name: string;
  /** Tamaño ya formateado para mostrar (p. ej. «248 KB»). */
  sizeLabel: string;
  isImage: boolean;
  /** Object URL de la miniatura; solo para imágenes, hay que revocarlo al soltarlo. */
  previewUrl: string | null;
  file: File;
}

/** Archivo descartado al seleccionarlo, con el motivo ya redactado. */
export interface RejectedFile {
  name: string;
  reason: string;
}

/**
 * Máquina de estados del flujo de análisis. Es una unión discriminada y no un
 * puñado de booleanos para que no existan estados imposibles (por ejemplo
 * «analizando» y «con resultado» a la vez).
 */
export interface IdleState {
  status: "idle";
}

export interface UploadingState {
  status: "uploading";
  /** Progreso real de subida (0-100), medido sobre los bytes enviados. */
  percent: number;
}

export interface AnalyzingState {
  status: "analyzing";
}

export interface SuccessState {
  status: "success";
  result: CvFormValues;
}

export interface ErrorState {
  status: "error";
  message: string;
}

export type CvAnalysisState =
  | IdleState
  | UploadingState
  | AnalyzingState
  | SuccessState
  | ErrorState;

/** Estados en los que hay una petición en vuelo. */
export type PendingStatus = UploadingState["status"] | AnalyzingState["status"];
