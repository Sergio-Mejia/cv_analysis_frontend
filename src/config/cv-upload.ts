/**
 * Restricciones de los archivos que se pueden analizar. Viven en `config/`
 * porque las comparten el hook del cliente y el Route Handler, que valida otra
 * vez por su cuenta: lo que llega del navegador nunca se da por bueno.
 */

export const MAX_CV_FILE_SIZE_BYTES = 10 * 1024 * 1024;
export const MAX_CV_FILE_SIZE_LABEL = "10 MB";

/** Valor del atributo `accept` del input de archivos. */
export const CV_FILE_INPUT_ACCEPT = "application/pdf,image/*";

const MIME_BY_EXTENSION: Record<string, string> = {
  pdf: "application/pdf",
  png: "image/png",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  webp: "image/webp",
  gif: "image/gif",
  heic: "image/heic",
  heif: "image/heif",
};

const IMAGE_EXTENSIONS = Object.keys(MIME_BY_EXTENSION).filter(
  (extension) => extension !== "pdf",
);

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

/**
 * Tipo MIME que se manda al backend para firmar la subida y que se envía como
 * `Content-Type` en el PUT a S3. Si el navegador no lo informa, se deduce de la
 * extensión: mandar una cadena vacía haría que S3 guardara el objeto sin tipo.
 */
export function resolveMimeType(file: FileDescriptor): string {
  if (file.type) return file.type;
  return MIME_BY_EXTENSION[extensionOf(file.name)] ?? "application/octet-stream";
}
