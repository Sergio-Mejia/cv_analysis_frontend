"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import {
  describeSignInError,
  describeSignInStep,
} from "@/features/auth/services/auth-messages";
import { login } from "@/features/auth/services/auth.service";
import { setSessionPersistence } from "@/features/auth/services/token-storage";
import type { LoginValues } from "@/features/auth/schemas/login.schema";
import type { AuthRequestState } from "@/features/auth/types/auth.types";

export interface UseLoginResult {
  state: AuthRequestState;
  submit: (values: LoginValues) => Promise<void>;
  reset: () => void;
}

/**
 * Orquesta el acceso: una única máquina de estados
 * (`idle → submitting → success | error`) en lugar de varios booleanos sueltos
 * que permitirían estados imposibles.
 *
 * No hay AbortController porque `signIn` de Amplify no acepta señal de
 * cancelación; lo que sí hay es un identificador incremental, para que la
 * respuesta de un intento anterior no pise el estado del intento actual, y una
 * marca de montaje que evita escribir estado en un componente ya desmontado.
 */
export function useLogin(): UseLoginResult {
  const [state, setState] = useState<AuthRequestState>({ status: "idle" });
  const requestIdRef = useRef(0);
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      // Invalida cualquier respuesta que aún esté en vuelo.
      requestIdRef.current += 1;
    };
  }, []);

  const submit = useCallback(async (values: LoginValues) => {
    requestIdRef.current += 1;
    const requestId = requestIdRef.current;
    const isStale = () =>
      !isMountedRef.current || requestId !== requestIdRef.current;

    setState({ status: "submitting" });

    try {
      // Antes de autenticar, porque decide cómo se guarda el token que emite
      // `signIn`.
      setSessionPersistence(values.rememberMe);

      const output = await login(values.identifier.trim(), values.password);

      if (isStale()) return;

      if (!output.isSignedIn) {
        setState({
          status: "error",
          message: describeSignInStep(output.nextStep.signInStep),
        });
        return;
      }

      setState({ status: "success" });
    } catch (error) {
      if (isStale()) return;

      if (error instanceof Error && error.name === "UserAlreadyAuthenticatedException") {
        setState({ status: "success" });
        return;
      }

      setState({ status: "error", message: describeSignInError(error) });
    }
  }, []);

  const reset = useCallback(() => {
    requestIdRef.current += 1;
    setState({ status: "idle" });
  }, []);

  return { state, submit, reset };
}
