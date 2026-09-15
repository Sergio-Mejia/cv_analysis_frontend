import type { ReactNode } from "react";

import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface FieldShellProps {
  /** `id` del control, para enlazar la etiqueta y los errores. */
  controlId: string;
  label: string;
  errors: string[];
  /**
   * Control alineado a la derecha de la etiqueta. El diseño lo usa para el
   * «Mostrar» de las contraseñas.
   */
  action?: ReactNode;
  /** Oculta la etiqueta visualmente sin quitarla del árbol de accesibilidad. */
  hideLabel?: boolean;
  className?: string;
  children: ReactNode;
}

/**
 * Envoltorio común de un campo de autenticación: etiqueta enlazada, control y
 * mensaje de error accesible.
 */
export function FieldShell({
  controlId,
  label,
  errors,
  action,
  hideLabel = false,
  className,
  children,
}: FieldShellProps) {
  const errorId = `${controlId}-error`;

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <div
        className={cn(
          "flex min-h-5 items-center justify-between gap-3",
          hideLabel && !action && "sr-only",
        )}
      >
        <Label
          htmlFor={controlId}
          className={cn(
            "text-xs font-semibold tracking-wider text-muted-foreground uppercase",
            hideLabel && "sr-only",
          )}
        >
          {label}
        </Label>

        {action}
      </div>

      {children}

      {errors.length > 0 && (
        <p id={errorId} className="text-xs text-destructive">
          {errors[0]}
        </p>
      )}
    </div>
  );
}
