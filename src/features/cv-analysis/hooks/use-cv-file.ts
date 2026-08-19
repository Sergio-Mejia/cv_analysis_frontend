"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import {
  MAX_CV_FILE_SIZE_BYTES,
  MAX_CV_FILE_SIZE_LABEL,
  isAcceptedCvFile,
  isImageFile,
} from "@/config/cv-upload";
import { formatFileSize } from "@/lib/format";

import type {
  RejectedFile,
  SelectedFile,
} from "@/features/cv-analysis/types/cv.types";

export interface UseCvFileResult {
  file: SelectedFile | null;
  /** Archivos descartados en la última selección, con el motivo. */
  rejected: RejectedFile[];
  selectFile: (incoming: FileList | File[]) => void;
  clearFile: () => void;
  dismissRejected: () => void;
}

/**
 * Gestiona el archivo seleccionado: valida tipo y tamaño, y se encarga del ciclo
 * de vida del object URL de la miniatura (crearlo y revocarlo al reemplazar, al
 * limpiar y al desmontar).
 *
 * El backend analiza un CV por llamada, así que solo se guarda un archivo:
 * elegir otro reemplaza al anterior.
 */
export function useCvFile(): UseCvFileResult {
  const [file, setFile] = useState<SelectedFile | null>(null);
  const [rejected, setRejected] = useState<RejectedFile[]>([]);
  // El object URL es un recurso imperativo: hay que poder revocarlo sin depender
  // de un render, así que el archivo actual vive también en un ref.
  const fileRef = useRef<SelectedFile | null>(null);
  const nextIdRef = useRef(0);

  const revokeCurrent = useCallback(() => {
    if (fileRef.current?.previewUrl) {
      URL.revokeObjectURL(fileRef.current.previewUrl);
    }
  }, []);

  const commit = useCallback((next: SelectedFile | null) => {
    fileRef.current = next;
    setFile(next);
  }, []);

  const selectFile = useCallback(
    (incoming: FileList | File[]) => {
      const list = Array.from(incoming);
      if (list.length === 0) return;

      const [candidate, ...extras] = list;
      const rejections: RejectedFile[] = extras.map((extra) => ({
        name: extra.name,
        reason: "solo se analiza un archivo a la vez",
      }));

      if (!isAcceptedCvFile(candidate)) {
        rejections.unshift({
          name: candidate.name,
          reason: "solo aceptamos PDF, JPG o PNG",
        });
        setRejected(rejections);
        return;
      }

      if (candidate.size > MAX_CV_FILE_SIZE_BYTES) {
        rejections.unshift({
          name: candidate.name,
          reason: `supera los ${MAX_CV_FILE_SIZE_LABEL}`,
        });
        setRejected(rejections);
        return;
      }

      revokeCurrent();
      nextIdRef.current += 1;
      const isImage = isImageFile(candidate);

      commit({
        id: `cv-file-${nextIdRef.current}`,
        name: candidate.name,
        sizeLabel: formatFileSize(candidate.size),
        isImage,
        previewUrl: isImage ? URL.createObjectURL(candidate) : null,
        file: candidate,
      });
      setRejected(rejections);
    },
    [commit, revokeCurrent],
  );

  const clearFile = useCallback(() => {
    revokeCurrent();
    commit(null);
    setRejected([]);
  }, [commit, revokeCurrent]);

  const dismissRejected = useCallback(() => setRejected([]), []);

  useEffect(
    () => () => {
      if (fileRef.current?.previewUrl) {
        URL.revokeObjectURL(fileRef.current.previewUrl);
      }
    },
    [],
  );

  return { file, rejected, selectFile, clearFile, dismissRejected };
}
