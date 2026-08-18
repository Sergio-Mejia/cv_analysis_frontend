/**
 * Restricciones de los archivos que se pueden analizar. Viven en `config/`
 * porque las comparten el hook del cliente y el Route Handler, que valida otra
 * vez por su cuenta: lo que llega del navegador nunca se da por bueno.
 */

export const MAX_CV_FILE_SIZE_BYTES = 10 * 1024 * 1024;
export const MAX_CV_FILE_SIZE_LABEL = "10 MB";
export const MAX_CV_FILES = 10;

/** Valor del atributo `accept` del input de archivos. */
export const CV_FILE_INPUT_ACCEPT = "application/pdf,image/*";

const IMAGE_EXTENSIONS = ["png", "jpg", "jpeg", "webp", "gif", "heic", "heif"];

/** Lo mínimo que necesitamos de un archivo para clasificarlo. */
export interface FileDescriptor {
  name: string;
  type: string;
}

function extensionOf(name: string): string {
  const parts = name.split(".");
  return parts.length > 1 ? (parts.pop() ?? "").toLowerCase() : "";
}

/**
 * El `type` puede llegar vacío según el sistema operativo, así que la extensión
 * hace de respaldo (es lo que hacía el mockup para elegir la miniatura).
 */
export function isImageFile(file: FileDescriptor): boolean {
  if (file.type.startsWith("image/")) return true;
  return IMAGE_EXTENSIONS.includes(extensionOf(file.name));
}

export function isPdfFile(file: FileDescriptor): boolean {
  return file.type === "application/pdf" || extensionOf(file.name) === "pdf";
}

export function isAcceptedCvFile(file: FileDescriptor): boolean {
  return isPdfFile(file) || isImageFile(file);
}
