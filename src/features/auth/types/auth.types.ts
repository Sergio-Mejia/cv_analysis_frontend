import type { AuthSession } from "@/features/auth/schemas/login.schema";

/**
 * Máquina de estados de una petición de autenticación. Es una unión discriminada
 * y no un puñado de booleanos para que no existan estados imposibles (por
 * ejemplo «enviando» y «con sesión» a la vez).
 */
export interface IdleState {
  status: "idle";
}

export interface SubmittingState {
  status: "submitting";
}

export interface AuthenticatedState {
  status: "success";
  session: AuthSession;
}

export interface AuthErrorState {
  status: "error";
  message: string;
}

export type AuthRequestState =
  | IdleState
  | SubmittingState
  | AuthenticatedState
  | AuthErrorState;
