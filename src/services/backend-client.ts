import type { ZodType } from "zod";

import { getServerEnv } from "@/config/env";

/**
 * Cliente del backend de análisis. **Solo servidor**: lee `CV_ANALYSIS_API_URL`,
 * que no lleva prefijo `NEXT_PUBLIC_`. Importarlo desde un componente de cliente
 * dejaría la variable sin valor.
 */

export class BackendError extends Error {
  /** Estado con el que responderá nuestro Route Handler. */
  readonly status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "BackendError";
    this.status = status;
  }
}

/** El backend responde los errores como `{ statusCode, message }`. */
function backendMessage(payload: unknown): string | null {
  if (payload === null || typeof payload !== "object") return null;

  const candidate = payload as { message?: unknown; error?: unknown };

  if (typeof candidate.message === "string" && candidate.message) {
    return candidate.message;
  }
  if (typeof candidate.error === "string" && candidate.error) {
    return candidate.error;
  }
  return null;
}

interface PostToBackendOptions<T> {
  /** Ruta relativa del backend, de `backendEndpoints`. */
  path: string;
  body: unknown;
  /** Valida la respuesta antes de reenviarla al navegador. */
  schema: ZodType<T>;
  signal?: AbortSignal;
  /**
   * `Authorization` de quien llamó al Route Handler, tal cual llegó. Se reenvía
   * para que el backend sepa **qué usuario** pide el análisis, no solo que la
   * petición viene de esta app.
   */
  authorization?: string | null;
}

export async function postToBackend<T>({
  path,
  body,
  schema,
  signal,
  authorization = null,
}: PostToBackendOptions<T>): Promise<T> {
  const { cvAnalysisApiUrl, cvAnalysisApiToken } = getServerEnv();

  if (!cvAnalysisApiUrl) {
    throw new BackendError(
      "El servicio de análisis no está configurado. Define CV_ANALYSIS_API_URL.",
      503,
    );
  }

  // Concatenación en lugar de `new URL(path, base)`: así una base con subruta
  // (`http://host/api`) no pierde ese prefijo.
  const url = `${cvAnalysisApiUrl.replace(/\/+$/, "")}${path}`;

  /*
   * El token del usuario manda sobre el estático. Solo cabe un `Authorization`,
   * y de los dos el útil es el que identifica a la persona: con él el backend
   * puede autorizar por usuario, no solo comprobar que la llamada viene de aquí.
   *
   * `CV_ANALYSIS_API_TOKEN` queda como respaldo para poder recorrer el flujo en
   * local sin Cognito configurado.
   */
  const forwardedAuthorization =
    authorization ??
    (cvAnalysisApiToken ? `Bearer ${cvAnalysisApiToken}` : null);

  let upstream: Response;
  try {
    upstream = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(forwardedAuthorization
          ? { Authorization: forwardedAuthorization }
          : {}),
      },
      body: JSON.stringify(body),
      signal,
    });
  } catch {
    throw new BackendError(
      "No pudimos contactar con el servicio de análisis.",
      502,
    );
  }

  const payload: unknown = await upstream.json().catch(() => null);

  if (!upstream.ok) {
    throw new BackendError(
      backendMessage(payload) ?? "El servicio de análisis devolvió un error.",
      // Un fallo del backend no es un fallo de este servidor.
      upstream.status >= 500 ? 502 : upstream.status,
    );
  }

  const parsed = schema.safeParse(payload);
  if (!parsed.success) {
    throw new BackendError(
      "El servicio de análisis devolvió datos que no reconocemos.",
      502,
    );
  }

  return parsed.data;
}
