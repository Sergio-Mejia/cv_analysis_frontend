import type { ReactNode } from "react";

import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface FieldShellProps {
  /** `id` del control, para enlazar la etiqueta y los errores. */
  controlId: string;
  label: string;
  errors: string[];
  /** Oculta la etiqueta visualmente sin quitarla del árbol de accesibilidad. */
  hideLabel?: boolean;
  className?: string;
  children: ReactNode;
}

/**
 * Envoltorio común de un campo: etiqueta enlazada, control y mensaje de error
 * accesible. Todos los campos lo comparten para no repetir el marcado.
 */
export function FieldShell({
  controlId,
  label,
  errors,
  hideLabel = false,
  className,
  children,
}: FieldShellProps) {
  const errorId = `${controlId}-error`;

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <Label
        htmlFor={controlId}
        className={cn(
          "text-xs font-semibold tracking-wider text-muted-foreground uppercase",
          hideLabel && "sr-only",
        )}
      >
        {label}
      </Label>

      {children}

      {errors.length > 0 && (
        <p id={errorId} className="text-xs text-destructive">
          {errors[0]}
        </p>
      )}
    </div>
  );
}
