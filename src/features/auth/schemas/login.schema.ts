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

/*
 * Aquí vivía `authSessionSchema`, que describía una sesión propia con token y
 * usuario. Ya no aplica: la sesión la emite y custodia Cognito, y quien la lee
 * es `fetchAuthSession()`, no una respuesta JSON nuestra. Validar en runtime
 * sigue siendo obligatorio para lo que venga del backend de análisis, pero los
 * tokens de Cognito los valida el propio SDK.
 */
