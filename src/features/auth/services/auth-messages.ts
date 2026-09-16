
const UNEXPECTED_ERROR = "Ocurrió un error inesperado al iniciar sesión.";

const ERROR_MESSAGES: Record<string, string> = {
  NotAuthorizedException: "Usuario o contraseña incorrectos.",
  UserNotFoundException: "Usuario o contraseña incorrectos.",
  UserNotConfirmedException:
    "Tu cuenta aún no está confirmada. Revisa el correo de confirmación.",
  PasswordResetRequiredException:
    "Debes restablecer tu contraseña antes de entrar.",
  TooManyRequestsException:
    "Demasiados intentos. Espera un momento y vuelve a probar.",
  TooManyFailedAttemptsException:
    "Demasiados intentos fallidos. Espera un momento y vuelve a probar.",
  LimitExceededException:
    "Demasiados intentos. Espera un momento y vuelve a probar.",
  NetworkError: "No hay conexión con el servicio de acceso. Revisa tu red.",
  InvalidParameterException:
    "Faltan datos para iniciar sesión o el formato no es válido.",
};

export function describeSignInError(error: unknown): string {
  if (error instanceof Error && error.name in ERROR_MESSAGES) {
    return ERROR_MESSAGES[error.name];
  }
  return UNEXPECTED_ERROR;
}

const NEXT_STEP_MESSAGES: Record<string, string> = {
  CONFIRM_SIGN_IN_WITH_NEW_PASSWORD_REQUIRED:
    "Debes definir una contraseña nueva antes de entrar. Contacta con el administrador.",
  CONFIRM_SIGN_IN_WITH_SMS_CODE:
    "Tu cuenta pide un código por SMS y esa verificación aún no está disponible aquí.",
  CONFIRM_SIGN_IN_WITH_EMAIL_CODE:
    "Tu cuenta pide un código por correo y esa verificación aún no está disponible aquí.",
  CONFIRM_SIGN_IN_WITH_TOTP_CODE:
    "Tu cuenta pide un código de la app de autenticación y esa verificación aún no está disponible aquí.",
  CONTINUE_SIGN_IN_WITH_MFA_SELECTION:
    "Tu cuenta pide un segundo factor y esa verificación aún no está disponible aquí.",
  CONTINUE_SIGN_IN_WITH_TOTP_SETUP:
    "Tu cuenta necesita configurar la app de autenticación y ese paso aún no está disponible aquí.",
  CONFIRM_SIGN_UP:
    "Tu cuenta aún no está confirmada. Revisa el correo de confirmación.",
  RESET_PASSWORD: "Debes restablecer tu contraseña antes de entrar.",
};

export function describeSignInStep(step: string): string {
  return (
    NEXT_STEP_MESSAGES[step] ??
    "El acceso necesita un paso adicional que todavía no está implementado."
  );
}
