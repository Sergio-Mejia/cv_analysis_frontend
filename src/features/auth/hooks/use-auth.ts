"use client";

import { useContext } from "react";

import {
  AuthContext,
  type AuthContextValue,
} from "@/features/auth/components/auth-provider";

/**
 * Acceso al estado de sesión. Falla si se usa fuera del proveedor en lugar de
 * devolver un valor por defecto: un «sin sesión» silencioso por haber olvidado
 * el proveedor es indistinguible de un cierre de sesión real.
 */
export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);

  if (context === null) {
    throw new Error("useAuth debe usarse dentro de <AuthProvider>.");
  }

  return context;
}
