import { isAcceptedCvFile } from "@/config/cv-upload";
import { backendEndpoints } from "@/config/endpoints";
import {
  presignedUploadSchema,
  presignedUrlRequestSchema,
} from "@/features/cv-analysis/schemas/cv-analysis.schema";
import { postToBackend } from "@/services/backend-client";

import { fail, failFromBackend, ok } from "../response";

/**
 * Paso 1 de 3: pide al backend una URL firmada de S3 para el archivo.
 *
 * Es un proxy para que la URL y el token del backend no lleguen al navegador; el
 * archivo no pasa por aquí, el navegador lo sube después directamente a S3.
 */
export async function POST(request: Request) {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return fail("La petición no es JSON válido.", 400);
  }

  const parsed = presignedUrlRequestSchema.safeParse(payload);
  if (!parsed.success) {
    return fail("Falta el nombre o el tipo del archivo.", 400);
  }

  const descriptor = {
    name: parsed.data.fileName,
    type: parsed.data.fileType,
  };

  if (!isAcceptedCvFile(descriptor)) {
    return fail(`«${parsed.data.fileName}» no es un PDF ni una imagen.`, 415);
  }

  try {
    const upload = await postToBackend({
      path: backendEndpoints.cvAnalysis.presignedUrl,
      body: parsed.data,
      schema: presignedUploadSchema,
      signal: request.signal,
    });
    return ok(upload);
  } catch (error) {
    return failFromBackend(error);
  }
}
