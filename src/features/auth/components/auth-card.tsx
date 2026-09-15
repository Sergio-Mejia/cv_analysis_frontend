import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

interface AuthCardProps {
  title: string;
  description: string;
  /** Marca o control de navegación que corona la tarjeta. */
  badge: ReactNode;
  className?: string;
  children: ReactNode;
}

/**
 * Tarjeta centrada de las pantallas de acceso. Solo pone el marco y la
 * cabecera: el formulario lo aporta cada pantalla.
 */
export function AuthCard({
  title,
  description,
  badge,
  className,
  children,
}: AuthCardProps) {
  return (
    <section
      className={cn(
        "w-full max-w-md animate-fade-up rounded-3xl border border-border/60 bg-card p-6 shadow-xl shadow-foreground/5 sm:p-8",
        className,
      )}
    >
      {badge}

      <h1 className="mt-5 text-2xl font-semibold tracking-tight text-balance sm:text-3xl">
        {title}
      </h1>
      <p className="mt-2 text-sm leading-relaxed text-pretty text-muted-foreground">
        {description}
      </p>

      <div className="mt-6">{children}</div>
    </section>
  );
}
