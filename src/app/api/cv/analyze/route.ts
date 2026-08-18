import { NextResponse } from "next/server";

import {
  MAX_CV_FILES,
  MAX_CV_FILE_SIZE_BYTES,
  MAX_CV_FILE_SIZE_LABEL,
  isAcceptedCvFile,
} from "@/config/cv-upload";
import { endpoints } from "@/config/endpoints";
import { getServerEnv } from "@/config/env";
import {
  cvAnalysisResultSchema,
  type CvAnalysisResult,
} from "@/features/cv-analysis/schemas/cv-analysis.schema";
import type { ApiResponse } from "@/types/api.types";

import { MOCK_ANALYSIS_RESULT } from "./mock-result";

/**
 * Proxy hacia el backend de análisis. Existe para que la URL y el token del
 * backend no salgan del servidor y para evitar CORS; no duplica nada de la
 * lógica de inferencia, que vive entera en el backend.
 *
 * Sin `CV_ANALYSIS_API_URL` configurada devuelve el resultado de ejemplo, de
 * modo que el flujo se puede recorrer de principio a fin en local.
 */

type AnalyzeResponse = ApiResponse<CvAnalysisResult | null>;

/** El mismo retardo que simulaba el mockup, para ver el estado de análisis. */
const MOCK_DELAY_MS = 2400;

function ok(data: CvAnalysisResult) {
  return NextResponse.json<AnalyzeResponse>({ data, error: null });
}

function fail(message: string, status: number) {
  return NextResponse.json<AnalyzeResponse>(
    { data: null, error: message },
    { status },
  );
}

function delay(ms: number, signal: AbortSignal): Promise<void> {
  return new Promise((resolve) => {
    const timer = setTimeout(resolve, ms);
    signal.addEventListener(
      "abort",
      () => {
        clearTimeout(timer);
        resolve();
      },
      { once: true },
    );
  });
}

/** El backend puede responder el objeto pelado o envuelto en `{ data }`. */
function unwrap(payload: unknown): unknown {
  if (payload !== null && typeof payload === "object" && "data" in payload) {
    return (payload as { data: unknown }).data;
  }
  return payload;
}

function upstreamMessage(payload: unknown): string | null {
  if (payload === null || typeof payload !== "object") return null;
  const candidate = payload as { error?: unknown; message?: unknown };
  if (typeof candidate.error === "string" && candidate.error) {
    return candidate.error;
  }
  if (typeof candidate.message === "string" && candidate.message) {
    return candidate.message;
  }
  return null;
}

export async function POST(request: Request) {
  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return fail("La petición no es un formulario válido.", 400);
  }

  const files = formData
    .getAll(endpoints.cvAnalysis.filesField)
    .filter((entry): entry is File => entry instanceof File);

  if (files.length === 0) {
    return fail("Adjunta al menos un archivo para analizar.", 400);
  }

  if (files.length > MAX_CV_FILES) {
    return fail(
      `Puedes analizar como máximo ${MAX_CV_FILES} archivos a la vez.`,
      400,
    );
  }

  for (const file of files) {
    if (!isAcceptedCvFile(file)) {
      return fail(`«${file.name}» no es un PDF ni una imagen.`, 415);
    }
    if (file.size > MAX_CV_FILE_SIZE_BYTES) {
      return fail(`«${file.name}» supera los ${MAX_CV_FILE_SIZE_LABEL}.`, 413);
    }
  }

  const { cvAnalysisApiUrl, cvAnalysisApiToken } = getServerEnv();

  if (!cvAnalysisApiUrl) {
    await delay(MOCK_DELAY_MS, request.signal);
    return ok(MOCK_ANALYSIS_RESULT);
  }

  let upstream: Response;
  try {
    upstream = await fetch(cvAnalysisApiUrl, {
      method: "POST",
      body: formData,
      headers: cvAnalysisApiToken
        ? { Authorization: `Bearer ${cvAnalysisApiToken}` }
        : undefined,
      signal: request.signal,
    });
  } catch {
    return fail("No pudimos contactar con el servicio de análisis.", 502);
  }

  const payload: unknown = await upstream.json().catch(() => null);

  if (!upstream.ok) {
    return fail(
      upstreamMessage(payload) ?? "El servicio de análisis devolvió un error.",
      502,
    );
  }

  const parsed = cvAnalysisResultSchema.safeParse(unwrap(payload));
  if (!parsed.success) {
    return fail(
      "El servicio de análisis devolvió datos que no reconocemos.",
      502,
    );
  }

  return ok(parsed.data);
}
