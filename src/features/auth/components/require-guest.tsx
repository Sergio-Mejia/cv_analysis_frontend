"use client";

import { useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";

import { SessionPending } from "@/features/auth/components/session-pending";
import { useAuth } from "@/features/auth/hooks/use-auth";

interface RequireGuestProps {
  children: ReactNode;
}

export function RequireGuest({ children }: RequireGuestProps) {
  const { state } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (state.status === "authenticated") {
      router.replace("/");
    }
  }, [state.status, router]);

  if (state.status !== "unauthenticated") {
    return <SessionPending />;
  }

  return <>{children}</>;
}
