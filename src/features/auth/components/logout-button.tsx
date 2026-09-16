"use client";

import { LogOutIcon } from "lucide-react";
import { useState } from "react";

import { Spinner } from "@/components/common/spinner";
import { Button } from "@/components/ui/button";

import { useAuth } from "@/features/auth/hooks/use-auth";

/**
 * Cierre de sesión. Se renderiza en la cabecera común, así que se borra solo
 * cuando no hay sesión: en el login no hay nada que cerrar.
 */
export function LogoutButton() {
  const { state, signOut } = useAuth();
  const [isSigningOut, setIsSigningOut] = useState(false);

  if (state.status !== "authenticated") return null;

  const handleSignOut = async () => {
    setIsSigningOut(true);
    try {
      await signOut();
    } finally {
      setIsSigningOut(false);
    }
  };

  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      disabled={isSigningOut}
      onClick={() => void handleSignOut()}
      className="h-8 gap-1.5 rounded-lg px-2.5 text-muted-foreground hover:text-foreground"
    >
      {isSigningOut ? <Spinner className="size-3.5" /> : <LogOutIcon />}
      <span className="hidden sm:inline">
        {isSigningOut ? "Cerrando…" : "Cerrar sesión"}
      </span>
    </Button>
  );
}
