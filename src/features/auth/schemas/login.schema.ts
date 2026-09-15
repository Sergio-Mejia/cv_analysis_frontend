import { z } from "zod";

/**
 * Fuente de verdad del acceso: de aquí salen la validación del formulario, el
 * tipo de sus valores y el contrato de la respuesta del backend.
 */

/** Longitud mínima que el diseño anuncia en el marcador de posición. */
export const MIN_PASSWORD_LENGTH = 8;

/**
 * El campo admite usuario o correo, así que no se valida como email: quien tenga
 * nombre de usuario no debe quedarse fuera por el formato.
 */
export const loginSchema = z.object({
  identifier: z.string().trim().min(1, "Escribe tu usuario o correo."),
  password: z
    .string()
    .min(
      MIN_PASSWORD_LENGTH,
      `La contraseña debe tener al menos ${MIN_PASSWORD_LENGTH} caracteres.`,
    ),
  rememberMe: z.boolean(),
});

export type LoginValues = z.infer<typeof loginSchema>;

/** Formulario vacío: el acceso no se prellena con nada. */
export const EMPTY_LOGIN_VALUES: LoginValues = {
  identifier: "",
  password: "",
  rememberMe: false,
};

/**
 * Sesión que devuelve el backend al autenticar. Se valida en runtime antes de
 * usarse, igual que el resto de respuestas que cruzan el límite.
 */
export const authSessionSchema = z.object({
  token: z.string().min(1),
  user: z.object({
    id: z.string().min(1),
    displayName: z.string().min(1),
    email: z.email(),
  }),
});

export type AuthSession = z.infer<typeof authSessionSchema>;
