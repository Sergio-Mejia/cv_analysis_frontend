import { backendEndpoints } from "@/config/endpoints";
import {
  analyzeRequestSchema,
  cvAnalysisResultSchema,
} from "@/features/cv-analysis/schemas/cv-analysis.schema";
import { postToBackend } from "@/services/backend-client";

import { fail, failFromBackend, ok } from "../response";

/**
 * Paso 3 de 3: manda a analizar el objeto que ya está en S3.
 *
 * Solo viaja la clave del objeto, así que el cuerpo es diminuto; el archivo lo
 * subió el navegador directamente a S3 en el paso 2.
 */
export async function POST(request: Request) {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return fail("La petición no es JSON válido.", 400);
  }

  const parsed = analyzeRequestSchema.safeParse(payload);
  if (!parsed.success) {
    return fail("Falta la clave del archivo que hay que analizar.", 400);
  }

  try {
    const result = await postToBackend({
      path: backendEndpoints.cvAnalysis.analyze,
      body: parsed.data,
      schema: cvAnalysisResultSchema,
      signal: request.signal,
    });
    return ok(result);
  } catch (error) {
    return failFromBackend(error);
  }
}
