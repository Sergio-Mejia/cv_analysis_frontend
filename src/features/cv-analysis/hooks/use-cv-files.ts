"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import {
  MAX_CV_FILES,
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

export interface UseCvFilesResult {
  files: SelectedFile[];
  /** Archivos descartados en la última selección, con el motivo. */
  rejected: RejectedFile[];
  addFiles: (incoming: FileList | File[]) => void;
  removeFile: (id: string) => void;
  clearFiles: () => void;
  dismissRejected: () => void;
}

/**
 * Gestiona los archivos seleccionados: valida tipo, tamaño y cantidad, y se
 * encarga del ciclo de vida de los object URL de las miniaturas (crearlos y
 * revocarlos al quitar un archivo, al limpiar y al desmontar).
 *
 * El estado vive también en un ref porque los object URL son un recurso
 * imperativo: hay que poder revocarlos sin depender de un render.
 */
export function useCvFiles(): UseCvFilesResult {
  const [files, setFiles] = useState<SelectedFile[]>([]);
  const [rejected, setRejected] = useState<RejectedFile[]>([]);
  const filesRef = useRef<SelectedFile[]>([]);
  const nextIdRef = useRef(0);

  const commit = useCallback((next: SelectedFile[]) => {
    filesRef.current = next;
    setFiles(next);
  }, []);

  const addFiles = useCallback(
    (incoming: FileList | File[]) => {
      const list = Array.from(incoming);
      if (list.length === 0) return;

      const current = filesRef.current;
      const accepted: SelectedFile[] = [];
      const rejections: RejectedFile[] = [];
      let room = MAX_CV_FILES - current.length;

      for (const file of list) {
        if (!isAcceptedCvFile(file)) {
          rejections.push({
            name: file.name,
            reason: "solo aceptamos PDF, JPG o PNG",
          });
          continue;
        }

        if (file.size > MAX_CV_FILE_SIZE_BYTES) {
          rejections.push({
            name: file.name,
            reason: `supera los ${MAX_CV_FILE_SIZE_LABEL}`,
          });
          continue;
        }

        if (room <= 0) {
          rejections.push({
            name: file.name,
            reason: `superarías el máximo de ${MAX_CV_FILES} archivos`,
          });
          continue;
        }

        room -= 1;
        nextIdRef.current += 1;
        const isImage = isImageFile(file);

        accepted.push({
          id: `cv-file-${nextIdRef.current}`,
          name: file.name,
          sizeLabel: formatFileSize(file.size),
          isImage,
          previewUrl: isImage ? URL.createObjectURL(file) : null,
          file,
        });
      }

      if (accepted.length > 0) commit([...current, ...accepted]);
      setRejected(rejections);
    },
    [commit],
  );

  const removeFile = useCallback(
    (id: string) => {
      const target = filesRef.current.find((file) => file.id === id);
      if (!target) return;

      if (target.previewUrl) URL.revokeObjectURL(target.previewUrl);
      commit(filesRef.current.filter((file) => file.id !== id));
    },
    [commit],
  );

  const clearFiles = useCallback(() => {
    for (const file of filesRef.current) {
      if (file.previewUrl) URL.revokeObjectURL(file.previewUrl);
    }
    commit([]);
    setRejected([]);
  }, [commit]);

  const dismissRejected = useCallback(() => setRejected([]), []);

  useEffect(
    () => () => {
      for (const file of filesRef.current) {
        if (file.previewUrl) URL.revokeObjectURL(file.previewUrl);
      }
    },
    [],
  );

  return { files, rejected, addFiles, removeFile, clearFiles, dismissRejected };
}
