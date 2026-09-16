"use client";

import { useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";

import { SessionPending } from "@/features/auth/components/session-pending";
import { useAuth } from "@/features/auth/hooks/use-auth";

interface RequireAuthProps {
  children: ReactNode;
}

export function RequireAuth({ children }: RequireAuthProps) {
  const { state } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (state.status === "unauthenticated") {
      router.replace("/login");
    }
  }, [state.status, router]);

  if (state.status !== "authenticated") {
    return <SessionPending />;
  }

  return <>{children}</>;
}
