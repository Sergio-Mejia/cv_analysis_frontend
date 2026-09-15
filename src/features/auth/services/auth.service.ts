import { ApiError } from "@/services/api-client";

import type {
  AuthSession,
  LoginValues,
} from "@/features/auth/schemas/login.schema";

/**
 * Rutas del acceso. Viven aquí y no en `config/endpoints.ts` porque todavía no
 * existe el Route Handler que las sirva; al conectarlas hay que moverlas allí,
 * junto al resto de rutas que conoce el navegador.
 */
export const authEndpoints = {
  login: "/api/auth/login",
} as const;

export interface LoginOptions {
  credentials: LoginValues;
  signal?: AbortSignal;
}

const NOT_WIRED =
  "El acceso todavía no está conectado al backend. Tus credenciales no se han enviado a ningún sitio.";

/**
 * Autentica al usuario y devuelve la sesión ya validada.
 *
 * ⚠️ Punto de integración. El contrato del backend de autenticación aún no está
 * definido, así que esta función falla de forma explícita en lugar de llamar a
 * una ruta inexistente: el formulario queda completo y la pantalla ejercita su
 * estado de error real, sin fingir un acceso que no ocurre.
 *
 * Para conectarlo:
 *
 * 1. Mueve `authEndpoints` a `config/endpoints.ts` y añade la ruta del backend
 *    a `backendEndpoints`.
 * 2. Crea el Route Handler proxy en `src/app/api/auth/login/route.ts` siguiendo
 *    el patrón de `src/app/api/cv/analyze/route.ts`, para que el token y la URL
 *    del backend no salgan del servidor.
 * 3. Sustituye el cuerpo de esta función por:
 *
 *    return postJson({
 *      path: authEndpoints.login,
 *      body: credentials,
 *      schema: authSessionSchema,
 *      signal,
 *    });
 */
export async function login({
  credentials,
  signal,
}: LoginOptions): Promise<AuthSession> {
  // Se leen para que el contrato de la función sea el definitivo y conectarla
  // no obligue a tocar quien la llama.
  void credentials;
  void signal;

  throw new ApiError(NOT_WIRED);
}
