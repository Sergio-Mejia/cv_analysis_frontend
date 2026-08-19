"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { ApiError, isAbortError } from "@/services/api-client";

import { analyzeCv } from "@/features/cv-analysis/services/cv-analysis.service";
import type { CvAnalysisState } from "@/features/cv-analysis/types/cv.types";

export interface UseCvAnalysisResult {
  state: CvAnalysisState;
  analyze: (file: File) => Promise<void>;
  reset: () => void;
}

const UNEXPECTED_ERROR = "Ocurrió un error inesperado al analizar el archivo.";

/**
 * Orquesta el análisis: una única máquina de estados
 * (`idle → uploading → analyzing → success | error`) en lugar de varios
 * booleanos sueltos que permitirían estados imposibles.
 *
 * `uploading` cubre el paso 1 (URL firmada) y el 2 (subida a S3); `analyzing`
 * empieza cuando el archivo ya está en S3 y el backend lo procesa.
 *
 * Cada intento tiene su propio AbortController y un identificador incremental;
 * si el usuario reintenta o se va de la página, la respuesta que llegue tarde se
 * descarta en lugar de sobrescribir el estado actual.
 */
export function useCvAnalysis(): UseCvAnalysisResult {
  const [state, setState] = useState<CvAnalysisState>({ status: "idle" });
  const controllerRef = useRef<AbortController | null>(null);
  const requestIdRef = useRef(0);

  const cancelPending = useCallback(() => {
    controllerRef.current?.abort();
    controllerRef.current = null;
    // Invalida cualquier respuesta que aún esté en vuelo.
    requestIdRef.current += 1;
  }, []);

  useEffect(() => () => cancelPending(), [cancelPending]);

  const analyze = useCallback(
    async (file: File) => {
      cancelPending();

      const controller = new AbortController();
      controllerRef.current = controller;
      const requestId = requestIdRef.current;
      const isStale = () => requestId !== requestIdRef.current;

      setState({ status: "uploading", percent: 0 });

      try {
        const result = await analyzeCv({
          file,
          signal: controller.signal,
          onUploadProgress: ({ percent }) => {
            if (isStale()) return;
            setState({ status: "uploading", percent });
          },
          onUploadComplete: () => {
            if (isStale()) return;
            setState({ status: "analyzing" });
          },
        });

        if (isStale()) return;
        setState({ status: "success", result });
      } catch (error) {
        if (isStale() || isAbortError(error)) return;
        setState({
          status: "error",
          message: error instanceof ApiError ? error.message : UNEXPECTED_ERROR,
        });
      } finally {
        if (controllerRef.current === controller) controllerRef.current = null;
      }
    },
    [cancelPending],
  );

  const reset = useCallback(() => {
    cancelPending();
    setState({ status: "idle" });
  }, [cancelPending]);

  return { state, analyze, reset };
}
