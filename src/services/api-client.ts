import { fetchAuthSession } from "aws-amplify/auth";
import { z, type ZodType } from "zod";

/**
 * Error de la capa de servicios. Cualquier fallo de red, de contrato o del
 * backend llega a los hooks con esta forma, con un mensaje ya presentable.
 */
export class ApiError extends Error {
  readonly status: number | null;

  constructor(message: string, status: number | null = null) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

/** ¿Es una cancelación provocada por nuestro propio AbortController? */
export function isAbortError(error: unknown): boolean {
  return error instanceof DOMException && error.name === "AbortError";
}

export interface UploadProgress {
  loaded: number;
  total: number;
  /** Entre 0 y 100. */
  percent: number;
}

const GENERIC_ERROR = "No pudimos completar la petición. Inténtalo de nuevo.";

function abortError(): DOMException {
  return new DOMException("La petición se canceló.", "AbortError");
}

/**
 * Token de la sesión actual para firmar las llamadas a nuestros Route Handlers.
 *
 * Se lee con el SDK y no con el `getIdToken` de `features/auth` a propósito:
 * `services/` es capa transversal y no debe depender de una feature — la
 * dependencia va en el otro sentido. `fetchAuthSession` ya renueva por su cuenta
 * un token caducado, así que aquí no hay que gestionar el refresco.
 *
 * Devuelve `null` en lugar de lanzar: sin sesión la petición sale sin cabecera y
 * es el servidor quien responde 401, que es donde debe decidirse.
 */
async function readIdToken(): Promise<string | null> {
  try {
    const session = await fetchAuthSession();
    return session.tokens?.idToken?.toString() ?? null;
  } catch {
    return null;
  }
}

/** Extrae el `data` del contenedor `ApiResponse` y lo valida con el schema. */
function readEnvelope<T>(
  status: number,
  rawBody: string,
  schema: ZodType<T>,
): T {
  const envelopeSchema = z.object({
    data: schema.nullable(),
    error: z.string().nullable(),
  });

  let payload: unknown = null;
  try {
    payload = JSON.parse(rawBody) as unknown;
  } catch {
    payload = null;
  }

  const envelope = envelopeSchema.safeParse(payload);
  const isOk = status >= 200 && status < 300;

  if (!isOk) {
    throw new ApiError(
      (envelope.success ? envelope.data.error : null) ?? GENERIC_ERROR,
      status,
    );
  }

  if (!envelope.success) {
    throw new ApiError(
      "El servidor devolvió una respuesta con un formato inesperado.",
      status,
    );
  }

  if (envelope.data.error !== null || envelope.data.data === null) {
    throw new ApiError(envelope.data.error ?? GENERIC_ERROR, status);
  }

  return envelope.data.data;
}

interface PostJsonOptions<T> {
  /** Ruta de un Route Handler de esta app. */
  path: string;
  body: unknown;
  schema: ZodType<T>;
  signal?: AbortSignal;
}

/**
 * POST con cuerpo JSON contra un Route Handler propio. Las cancelaciones se
 * propagan tal cual (`AbortError`) para que quien llama pueda distinguirlas de
 * un fallo real; todo lo demás se normaliza a `ApiError`.
 *
 * Adjunta el token de la sesión en `Authorization`. Es el único punto por el que
 * pasan las llamadas a nuestras rutas, así que todas quedan firmadas sin que
 * cada service tenga que acordarse.
 */
export async function postJson<T>({
  path,
  body,
  schema,
  signal,
}: PostJsonOptions<T>): Promise<T> {
  const token = await readIdToken();
  let response: Response;

  try {
    response = await fetch(path, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(body),
      signal,
    });
  } catch (error) {
    if (isAbortError(error)) throw error;
    throw new ApiError("No hay conexión con el servidor.");
  }

  return readEnvelope(response.status, await response.text(), schema);
}

/** S3 devuelve los errores en XML, no en JSON. */
function readStorageError(body: string): string {
  const message = /<Message>([^<]+)<\/Message>/.exec(body);
  return message?.[1] ?? "El almacenamiento rechazó el archivo.";
}

interface PutFileOptions {
  /** URL firmada devuelta por el backend. */
  url: string;
  file: File;
  contentType: string;
  signal?: AbortSignal;
  onProgress?: (progress: UploadProgress) => void;
}

/**
 * Sube el archivo directamente a S3 con la URL firmada, sin pasar por nuestro
 * servidor: para eso existe la URL firmada.
 *
 * Va con XMLHttpRequest y no con `fetch` porque es la única forma de observar el
 * progreso de subida, que con archivos de hasta 10 MB el usuario nota.
 *
 * Aquí **no** se manda `Authorization`, y no es un olvido: la URL ya lleva la
 * firma de AWS en la query, y añadir una segunda credencial hace que S3 rechace
 * la subida entera («only one auth mechanism allowed»). Quien autoriza esta
 * subida es la firma, que emitió el backend en el paso 1 tras comprobar el token.
 */
export function putFile({
  url,
  file,
  contentType,
  signal,
  onProgress,
}: PutFileOptions): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    if (signal?.aborted) {
      reject(abortError());
      return;
    }

    const xhr = new XMLHttpRequest();
    const onAbort = () => xhr.abort();
    const cleanup = () => signal?.removeEventListener("abort", onAbort);

    xhr.open("PUT", url);
    xhr.setRequestHeader("Content-Type", contentType);
    xhr.responseType = "text";

    if (onProgress) {
      xhr.upload.addEventListener("progress", (event) => {
        if (!event.lengthComputable) return;
        onProgress({
          loaded: event.loaded,
          total: event.total,
          percent: Math.round((event.loaded / event.total) * 100),
        });
      });
    }

    xhr.addEventListener("load", () => {
      cleanup();
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve();
        return;
      }
      reject(new ApiError(readStorageError(xhr.responseText), xhr.status));
    });

    xhr.addEventListener("error", () => {
      cleanup();
      reject(new ApiError("No se pudo subir el archivo al almacenamiento."));
    });

    xhr.addEventListener("timeout", () => {
      cleanup();
      reject(new ApiError("La subida del archivo tardó demasiado."));
    });

    xhr.addEventListener("abort", () => {
      cleanup();
      reject(abortError());
    });

    signal?.addEventListener("abort", onAbort);
    xhr.send(file);
  });
}
