/**
 * Estado de la sesión en el navegador. `checking` es un estado real y no un
 * booleano `isLoading`: al arrancar todavía no se sabe si hay sesión, y tratar
 * ese instante como «sin sesión» expulsaría al login a quien sí la tiene.
 */
export interface CheckingSessionState {
  status: "checking";
}

export interface AuthenticatedState {
  status: "authenticated";
}

export interface UnauthenticatedState {
  status: "unauthenticated";
}

export type SessionState =
  | CheckingSessionState
  | AuthenticatedState
  | UnauthenticatedState;

/**
 * Máquina de estados del envío del formulario de acceso. Es una unión
 * discriminada y no un puñado de booleanos para que no existan estados
 * imposibles (por ejemplo «enviando» y «con error» a la vez).
 */
export interface IdleState {
  status: "idle";
}

export interface SubmittingState {
  status: "submitting";
}

/**
 * El acceso terminó y Cognito ya tiene sesión. No lleva datos: la sesión la
 * custodia Amplify y la expone el contexto, no esta máquina de estados.
 */
export interface SucceededState {
  status: "success";
}

export interface AuthErrorState {
  status: "error";
  message: string;
}

export type AuthRequestState =
  | IdleState
  | SubmittingState
  | SucceededState
  | AuthErrorState;
