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

interface PostFormDataOptions<T> {
  path: string;
  body: FormData;
  /** Schema del contenido de `data`; la respuesta se valida antes de devolverse. */
  schema: ZodType<T>;
  signal?: AbortSignal;
  /** Progreso de subida de los archivos. */
  onUploadProgress?: (progress: UploadProgress) => void;
  /** Se llama cuando el último byte ya salió y solo queda esperar al backend. */
  onUploadComplete?: () => void;
}

interface RawResponse {
  status: number;
  body: string;
}

const GENERIC_ERROR = "No pudimos completar la petición. Inténtalo de nuevo.";

function abortError(): DOMException {
  return new DOMException("La petición se canceló.", "AbortError");
}

/**
 * Envía el multipart con XMLHttpRequest en lugar de `fetch` porque es la única
 * forma de observar el progreso de subida: con archivos de hasta 10 MB la
 * diferencia entre «subiendo» y «analizando» es visible para el usuario.
 */
function sendFormData(
  path: string,
  body: FormData,
  signal: AbortSignal | undefined,
  onUploadProgress: ((progress: UploadProgress) => void) | undefined,
  onUploadComplete: (() => void) | undefined,
): Promise<RawResponse> {
  return new Promise<RawResponse>((resolve, reject) => {
    if (signal?.aborted) {
      reject(abortError());
      return;
    }

    const xhr = new XMLHttpRequest();
    const onAbort = () => xhr.abort();

    const cleanup = () => signal?.removeEventListener("abort", onAbort);

    xhr.open("POST", path);
    xhr.responseType = "text";

    if (onUploadProgress) {
      xhr.upload.addEventListener("progress", (event) => {
        if (!event.lengthComputable) return;
        onUploadProgress({
          loaded: event.loaded,
          total: event.total,
          percent: Math.round((event.loaded / event.total) * 100),
        });
      });
    }

    if (onUploadComplete) {
      xhr.upload.addEventListener("load", () => onUploadComplete());
    }

    xhr.addEventListener("load", () => {
      cleanup();
      resolve({ status: xhr.status, body: xhr.responseText });
    });
    xhr.addEventListener("error", () => {
      cleanup();
      reject(new ApiError("No hay conexión con el servidor."));
    });
    xhr.addEventListener("timeout", () => {
      cleanup();
      reject(new ApiError("El servidor tardó demasiado en responder."));
    });
    xhr.addEventListener("abort", () => {
      cleanup();
      reject(abortError());
    });

    signal?.addEventListener("abort", onAbort);
    xhr.send(body);
  });
}

/**
 * Envía un multipart a un Route Handler de esta app y devuelve el `data` del
 * contenedor `ApiResponse` ya validado.
 *
 * Las cancelaciones se propagan tal cual (`AbortError`) para que quien llama
 * pueda distinguirlas de un fallo real; todo lo demás se normaliza a ApiError.
 */
export async function postFormData<T>({
  path,
  body,
  schema,
  signal,
  onUploadProgress,
  onUploadComplete,
}: PostFormDataOptions<T>): Promise<T> {
  const { status, body: rawBody } = await sendFormData(
    path,
    body,
    signal,
    onUploadProgress,
    onUploadComplete,
  );

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
