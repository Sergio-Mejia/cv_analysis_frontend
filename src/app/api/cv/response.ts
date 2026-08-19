import { NextResponse } from "next/server";

import { BackendError } from "@/services/backend-client";
import type { ApiResponse } from "@/types/api.types";

/**
 * Respuestas compartidas por los Route Handlers de la feature. Todas usan el
 * contenedor `ApiResponse`, que es lo que valida el api-client del navegador.
 *
 * Este archivo no es una ruta: solo `route.ts` lo es.
 */

export function ok<T>(data: T) {
  return NextResponse.json<ApiResponse<T | null>>({ data, error: null });
}

export function fail(message: string, status: number) {
  return NextResponse.json<ApiResponse<null>>(
    { data: null, error: message },
    { status },
  );
}

/** Traduce un fallo del backend conservando su mensaje, que es el útil. */
export function failFromBackend(error: unknown) {
  if (error instanceof BackendError) {
    return fail(error.message, error.status);
  }
  return fail("Ocurrió un error inesperado al analizar el archivo.", 500);
}
