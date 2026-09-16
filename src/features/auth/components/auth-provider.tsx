"use client";

import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { Hub } from "aws-amplify/utils";

import { getIdToken, logout } from "@/features/auth/services/auth.service";
import type { SessionState } from "@/features/auth/types/auth.types";

export interface AuthContextValue {
  state: SessionState;
  /** Vuelve a preguntar a Cognito si hay sesión. */
  refresh: () => Promise<void>;
  signOut: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [state, setState] = useState<SessionState>({ status: "checking" });
  const isMountedRef = useRef(true);

  const refresh = useCallback(async () => {
    try {
      const token = await getIdToken();
      if (!isMountedRef.current) return;
      setState({ status: token ? "authenticated" : "unauthenticated" });
    } catch {
      // Un token caducado que no se puede refrescar llega aquí: es una sesión
      // que ya no sirve, así que cuenta como no autenticado.
      if (!isMountedRef.current) return;
      setState({ status: "unauthenticated" });
    }
  }, []);

  useEffect(() => {
    isMountedRef.current = true;

    // La regla no distingue una función async: `refresh` espera a Cognito antes
    // de tocar el estado, así que el setState ocurre en un microtask posterior y
    // no encadena renders. Es la lectura inicial de un sistema externo, que es
    // justo el caso que la propia regla contempla.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void refresh();

    const unsubscribe = Hub.listen("auth", ({ payload }) => {
      switch (payload.event) {
        case "signedIn":
        case "signedOut":
        case "tokenRefresh":
        case "tokenRefresh_failure":
          void refresh();
          break;
        default:
          break;
      }
    });

    return () => {
      isMountedRef.current = false;
      unsubscribe();
    };
  }, [refresh]);

  const signOut = useCallback(async () => {
    // Se marca antes de la llamada para que la UI no siga ofreciendo la sesión
    // mientras Cognito la cierra.
    setState({ status: "unauthenticated" });
    try {
      await logout();
    } finally {
      await refresh();
    }
  }, [refresh]);

  const value = useMemo<AuthContextValue>(
    () => ({ state, refresh, signOut }),
    [state, refresh, signOut],
  );

  return <AuthContext value={value}>{children}</AuthContext>;
}
