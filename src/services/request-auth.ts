/**
 * Lectura del `Authorization` que llega a un Route Handler. **Solo servidor.**
 */

/** Un `Bearer` seguido de algo: aquí no se valida la firma, solo la forma. */
const BEARER_PATTERN = /^Bearer\s+\S+$/i;

/**
 * Devuelve la cabecera `Authorization` tal cual para poder reenviarla, o `null`
 * si no viene o no tiene forma de bearer.
 *
 * No se verifica el token: esta capa solo comprueba que hay uno y lo pasa. Quien
 * valida la firma, el emisor y la caducidad es el backend, que es el único que
 * debe decidir si la petición se atiende.
 */
export function readAuthorization(request: Request): string | null {
  const header = request.headers.get("authorization")?.trim();

  if (header === undefined || !BEARER_PATTERN.test(header)) return null;

  return header;
}
