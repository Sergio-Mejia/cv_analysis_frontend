"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { ApiError, isAbortError } from "@/services/api-client";

import type { LoginValues } from "@/features/auth/schemas/login.schema";
import { login } from "@/features/auth/services/auth.service";
import type { AuthRequestState } from "@/features/auth/types/auth.types";

export interface UseLoginResult {
  state: AuthRequestState;
  submit: (values: LoginValues) => Promise<void>;
  reset: () => void;
}

const UNEXPECTED_ERROR = "Ocurrió un error inesperado al iniciar sesión.";

/**
 * Orquesta el acceso: una única máquina de estados
 * (`idle → submitting → success | error`) en lugar de varios booleanos sueltos
 * que permitirían estados imposibles.
 *
 * Cada intento tiene su propio AbortController y un identificador incremental;
 * si el usuario reintenta o se va de la página, la respuesta que llegue tarde se
 * descarta en lugar de sobrescribir el estado actual.
 */
export function useLogin(): UseLoginResult {
  const [state, setState] = useState<AuthRequestState>({ status: "idle" });
  const controllerRef = useRef<AbortController | null>(null);
  const requestIdRef = useRef(0);

  const cancelPending = useCallback(() => {
    controllerRef.current?.abort();
    controllerRef.current = null;
    // Invalida cualquier respuesta que aún esté en vuelo.
    requestIdRef.current += 1;
  }, []);

  useEffect(() => () => cancelPending(), [cancelPending]);

  const submit = useCallback(
    async (credentials: LoginValues) => {
      cancelPending();

      const controller = new AbortController();
      controllerRef.current = controller;
      const requestId = requestIdRef.current;
      const isStale = () => requestId !== requestIdRef.current;

      setState({ status: "submitting" });

      try {
        const session = await login({
          credentials,
          signal: controller.signal,
        });

        if (isStale()) return;
        setState({ status: "success", session });
      } catch (error) {
        if (isStale() || isAbortError(error)) return;
        setState({
          status: "error",
          message: error instanceof ApiError ? error.message : UNEXPECTED_ERROR,
        });
      } finally {
        if (controllerRef.current === controller) controllerRef.current = null;
      }
    },
    [cancelPending],
  );

  const reset = useCallback(() => {
    cancelPending();
    setState({ status: "idle" });
  }, [cancelPending]);

  return { state, submit, reset };
}
